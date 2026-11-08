const express = require("express");
const cors = require("cors");
const multer = require("multer");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

/* =====================================================
   SETTINGS: yahan apne courses, fees aur timings likho
   (course ke naam bilkul wahi hon jo form mein hain)
   ===================================================== */
const COURSES = {
  "Office Automation":     { code: "OA",  fees: "Rs. 4999/-" },
  "Graphic Designing":     { code: "GD",  fees: "Rs. 4999/-" },
  "Digital Marketing":     { code: "DM",  fees: "Rs. 4999/-" },
  "Web & App Development": { code: "WEB", fees: "Rs. 4999/-" },
  "Power BI":              { code: "PBI", fees: "Rs. 4999/-" },
};

// Card par jo batch likha aye
const BATCH = "1";

// Student jo time chune, card par wo aise likha aye
// (real timings likh sakti ho, maslan "Mon to Fri ( 3pm to 5pm )")
const TIMINGS = {
  Morning: "Morning",
  Afternoon: "Afternoon",
  Evening: "Evening",
};

/* ---------- Folders ---------- */
const DATA_DIR = path.join(__dirname, "data");
const UPLOAD_DIR = path.join(__dirname, "uploads");
const EXCEL_FILE = path.join(DATA_DIR, "registrations.xlsx");

[DATA_DIR, UPLOAD_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use("/uploads", express.static(UPLOAD_DIR));

/* ---------- Photo upload (JPG/PNG, max 2MB) ---------- */
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG or PNG photos are allowed"));
  },
});

/* ---------- Excel columns ---------- */
const COLUMNS = [
  { header: "Roll No", key: "rollNo", width: 18 },
  { header: "Submitted At", key: "createdAt", width: 22 },
  { header: "Full Name", key: "fullName", width: 24 },
  { header: "Guardian Name", key: "guardian", width: 24 },
  { header: "Email", key: "email", width: 28 },
  { header: "Phone", key: "phone", width: 16 },
  { header: "City", key: "city", width: 16 },
  { header: "CNIC", key: "cnic", width: 18 },
  { header: "Gender", key: "gender", width: 10 },
  { header: "Date of Birth", key: "dob", width: 14 },
  { header: "Qualification", key: "qualification", width: 16 },
  { header: "Address", key: "address", width: 34 },
  { header: "Institute", key: "institute", width: 30 },
  { header: "Course", key: "course", width: 24 },
  { header: "Preferred Time", key: "time", width: 14 },
  { header: "Batch", key: "batch", width: 10 },
  { header: "Fees", key: "fees", width: 14 },
  { header: "Photo File", key: "photo", width: 26 },
];

async function openSheet() {
  const wb = new ExcelJS.Workbook();
  if (fs.existsSync(EXCEL_FILE)) await wb.xlsx.readFile(EXCEL_FILE);

  let ws = wb.getWorksheet("Registrations");
  if (!ws) {
    ws = wb.addWorksheet("Registrations");
    ws.columns = COLUMNS;
    const head = ws.getRow(1);
    head.font = { bold: true, color: { argb: "FFFFFFFF" } };
    head.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E8C" } };
    ws.views = [{ state: "frozen", ySplit: 1 }];
  }
  return { wb, ws };
}

function rowToObj(row) {
  const obj = {};
  COLUMNS.forEach((c, i) => {
    const v = row.getCell(i + 1).value;
    obj[c.key] = v === null || v === undefined ? "" : String(v);
  });
  return obj;
}

// Card ko jo data chahiye wo yahan se banta hai
function toCard(r) {
  return {
    name: r.fullName.toUpperCase(),
    dob: r.dob,
    father: r.guardian.toUpperCase(),
    phone: r.phone,
    gender: r.gender,
    cnic: r.cnic,
    email: r.email,
    address: r.address,
    course: r.course,
    batch: r.batch,
    classTime: TIMINGS[r.time] || r.time,
    rollNo: r.rollNo,
    amount: r.fees,
    photo: `/uploads/${r.photo}`,
  };
}

const digits = (s) => String(s || "").replace(/\D/g, "");

/* Ek waqt mein sirf ek hi write ho (Excel file corrupt na ho) */
let queue = Promise.resolve();
const enqueue = (task) => {
  const run = queue.then(task);
  queue = run.catch(() => {});
  return run;
};

/* ---------- Routes ---------- */
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.post("/api/register", upload.single("photo"), async (req, res) => {
  const removePhoto = () => {
    if (req.file) fs.unlink(req.file.path, () => {});
  };
  const fail = (code, message) => {
    removePhoto();
    return res.status(code).json({ message });
  };

  try {
    const b = req.body;

    const required = [
      "institute", "course", "time", "fullName", "guardian", "email",
      "phone", "city", "cnic", "gender", "dob", "qualification", "address",
    ];
    const missing = required.filter((k) => !b[k] || !String(b[k]).trim());
    if (missing.length || !req.file) {
      return fail(400, "Please fill all required fields and upload a photo.");
    }
    if (!COURSES[b.course]) return fail(400, "Invalid course selected.");

    const cnic = digits(b.cnic);
    const phone = digits(b.phone);
    if (cnic.length !== 13) return fail(400, "CNIC / B-Form must be 13 digits.");
    if (!/^03\d{9}$/.test(phone)) return fail(400, "Contact number must be like 03XXXXXXXXX.");

    const result = await enqueue(async () => {
      const { wb, ws } = await openSheet();

      // Pehle se registered? (same CNIC + same course)
      let existing = null;
      ws.eachRow((row, n) => {
        if (n === 1) return;
        const r = rowToObj(row);
        if (r.cnic === cnic && r.course === b.course) existing = r;
      });
      if (existing) {
        // Phone bhi match kare to wohi purana card dobara de do
        return existing.phone === phone ? { record: existing, repeat: true } : { duplicate: true };
      }

      // Roll number: SAIT-<CODE>-0001
      const prefix = `SAIT-${COURSES[b.course].code}-`;
      let max = 0;
      ws.eachRow((row, n) => {
        if (n === 1) return;
        const roll = String(row.getCell(1).value || "");
        if (roll.startsWith(prefix)) max = Math.max(max, parseInt(roll.slice(prefix.length), 10) || 0);
      });

      const record = {
        rollNo: prefix + String(max + 1).padStart(4, "0"),
        createdAt: new Date().toLocaleString("en-PK"),
        ...Object.fromEntries(required.map((k) => [k, String(b[k]).trim()])),
        cnic,
        phone,
        batch: BATCH,
        fees: COURSES[b.course].fees,
        photo: req.file.filename,
      };

      ws.addRow(COLUMNS.map((c) => record[c.key]));
      await wb.xlsx.writeFile(EXCEL_FILE);
      return { record };
    });

    if (result.duplicate) {
      return fail(409, "This CNIC is already registered for this course.");
    }
    if (result.repeat) removePhoto(); // nayi photo ki zaroorat nahi

    res.status(201).json({ success: true, student: toCard(result.record) });
  } catch (err) {
    removePhoto();
    console.error(err);
    const locked = err.code === "EBUSY" || err.code === "EPERM";
    res.status(500).json({
      message: locked
        ? "Excel file is open. Please close it and try again."
        : "Something went wrong on the server.",
    });
  }
});

/* ---------- Error handler (multer errors) ---------- */
app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message || "Upload failed" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`SAIT server running on http://localhost:${PORT}`));
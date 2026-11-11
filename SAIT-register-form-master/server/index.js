const express = require("express");
const cors = require("cors");
const multer = require("multer");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- Folders / files ---------- */
const DATA_DIR = path.join(__dirname, "data");
const UPLOAD_DIR = path.join(__dirname, "uploads");
const EXCEL_FILE = path.join(DATA_DIR, "registrations.xlsx");
const COURSES_FILE = path.join(__dirname, "courses.json");

[DATA_DIR, UPLOAD_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use("/uploads", express.static(UPLOAD_DIR));

/* Courses har request par file se parhe jate hain,
   is liye courses.json badalne par server restart nahi karna parta */
function loadCourses() {
  return JSON.parse(fs.readFileSync(COURSES_FILE, "utf8"));
}

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
  { header: "Class Time", key: "classTime", width: 28 },
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
    classTime: r.classTime,
    rollNo: r.rollNo,
    amount: r.fees,
    photo: `/uploads/${r.photo}`,
  };
}

const digits = (s) => String(s || "").replace(/\D/g, "");

/* Ek waqt mein sirf ek hi read/write ho (Excel file corrupt na ho) */
let queue = Promise.resolve();
const enqueue = (task) => {
  const run = queue.then(task);
  queue = run.catch(() => {});
  return run;
};

/* ---------- Routes ---------- */
app.get("/api/health", (req, res) => res.json({ ok: true }));

/* Form ke dropdown ke liye: sirf wo courses jo open hain aur jin mein seats bachi hain */
app.get("/api/courses", async (req, res) => {
  try {
    const courses = loadCourses().filter((c) => c.open !== false);

    // Har course+batch mein ab tak kitne students register hue
    let counts = {};
    try {
      counts = await enqueue(async () => {
        const { ws } = await openSheet();
        const map = {};
        ws.eachRow((row, n) => {
          if (n === 1) return;
          const r = rowToObj(row);
          const key = `${r.course}|${r.batch}`;
          map[key] = (map[key] || 0) + 1;
        });
        return map;
      });
    } catch (e) {
      console.error("Could not count registrations:", e.message);
    }

    const list = courses
      .map((c) => {
        const taken = counts[`${c.name}|${c.batch}`] || 0;
        const seatsLeft = c.seats ? Math.max(c.seats - taken, 0) : null;
        return { name: c.name, classTime: c.classTime, fees: c.fees, seatsLeft };
      })
      .filter((c) => c.seatsLeft === null || c.seatsLeft > 0);

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load courses. Please check courses.json." });
  }
});

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
      "institute", "course", "fullName", "guardian", "email",
      "phone", "city", "cnic", "gender", "dob", "qualification", "address",
    ];
    const missing = required.filter((k) => !b[k] || !String(b[k]).trim());
    if (missing.length || !req.file) {
      return fail(400, "Please fill all required fields and upload a photo.");
    }

    // Course abhi open hai?
    let courses;
    try {
      courses = loadCourses();
    } catch {
      return fail(500, "Courses could not be loaded. Please contact the institute.");
    }
    const course = courses.find((c) => c.name === b.course && c.open !== false);
    if (!course) return fail(400, "This course is not open for registration right now.");

    const cnic = digits(b.cnic);
    const phone = digits(b.phone);
    if (cnic.length !== 13) return fail(400, "CNIC / B-Form must be 13 digits.");
    if (!/^03\d{9}$/.test(phone)) return fail(400, "Contact number must be like 03XXXXXXXXX.");

    const result = await enqueue(async () => {
      const { wb, ws } = await openSheet();

      // Pehle se registered? (same CNIC + same course)
      let existing = null;
      let taken = 0;
      ws.eachRow((row, n) => {
        if (n === 1) return;
        const r = rowToObj(row);
        if (r.cnic === cnic && r.course === course.name) existing = r;
        if (r.course === course.name && r.batch === String(course.batch)) taken++;
      });
      if (existing) {
        // Phone bhi match kare to wohi purana card dobara de do
        return existing.phone === phone ? { record: existing, repeat: true } : { duplicate: true };
      }

      // Seats khatam?
      if (course.seats && taken >= course.seats) return { full: true };

      // Roll number: SAIT-<CODE>-0001
      const prefix = `SAIT-${course.code}-`;
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
        classTime: course.classTime,
        batch: String(course.batch),
        fees: course.fees,
        photo: req.file.filename,
      };

      ws.addRow(COLUMNS.map((c) => record[c.key]));
      await wb.xlsx.writeFile(EXCEL_FILE);
      return { record };
    });

    if (result.duplicate) return fail(409, "This CNIC is already registered for this course.");
    if (result.full) return fail(409, "Sorry, seats for this course are full.");
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
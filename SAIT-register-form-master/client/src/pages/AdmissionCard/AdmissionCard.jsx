import React, { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const saitLogo = "/saitlogo.jpg";
const BLUE = "#1F4E8C";

// QR scan karne par ye website khulegi (apna asli link yahan likho)
const SAIT_WEBSITE = "https://sait.pk";

// 2010-11-11 -> 11-11-2010
const fmtDob = (d) =>
  d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split("-").reverse().join("-") : d;

const Cell = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-[13px]">
    <span className="font-semibold shrink-0" style={{ color: BLUE }}>{label}</span>
    <span className="text-right text-gray-800 break-words min-w-0">{value}</span>
  </div>
);

const AdmissionCard = () => {
  const pageRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  let student = null;
  try {
    student = JSON.parse(sessionStorage.getItem("saitCard"));
  } catch {
    student = null;
  }
  if (!student) return <Navigate to="/" replace />;

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      if (document.fonts?.ready) await document.fonts.ready;

      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const img = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ unit: "mm", format: "a4" });

      // A4 page par fit karo (width 210mm, height 297mm)
      const pageW = 210;
      const pageH = 297;
      let w = pageW;
      let h = (pageW * canvas.height) / canvas.width;
      if (h > pageH) {
        h = pageH;
        w = (pageH * canvas.width) / canvas.height;
      }

      pdf.addImage(img, "JPEG", (pageW - w) / 2, 0, w, h);

      const fileName = `SAIT-${String(student.rollNo).replace(/[^\w-]/g, "")}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error(err);
      alert("PDF could not be created. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="py-8 print:py-0">
      {/* TOP BAR (print/PDF mein nahi aata) */}
      <div className="max-w-[794px] mx-auto mb-4 flex items-center justify-between print:hidden px-4">
        <Link to="/" className="text-sm font-semibold text-[#1F4E8C]">
          ← New Registration
        </Link>

        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="border border-[#1F4E8C] text-[#1F4E8C] font-semibold px-5 py-2 rounded hover:bg-blue-50"
          >
            Print
          </button>
          <button
            onClick={downloadPdf}
            disabled={downloading}
            className="bg-[#1F4E8C] hover:bg-[#173b6c] disabled:opacity-60 text-white font-semibold px-6 py-2 rounded"
          >
            {downloading ? "Preparing PDF..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* A4 PAGE */}
      <div
        ref={pageRef}
        className="w-[794px] mx-auto bg-white p-8 shadow-md print:shadow-none"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img src={saitLogo} alt="SAIT" className="h-14 w-auto object-contain" />
            <div className="leading-tight">
              <p className="font-bold text-lg" style={{ color: BLUE }}>SAIT</p>
              <p className="text-[10px] text-gray-500">Sir Adamjee Institute of Technology</p>
            </div>
          </div>
          <p className="text-[11px] font-semibold text-gray-500">Learn • Practice • Grow</p>
        </div>

        {/* TITLE */}
        <div className="text-white text-center font-bold py-2 text-lg" style={{ background: BLUE }}>
          REGISTRATION FORM
        </div>

        {/* DETAILS TABLE */}
        <div className="border border-gray-800 border-t-0 grid grid-cols-2 divide-x divide-gray-800">
          {[
            [["Name", student.name], ["Date of Birth", fmtDob(student.dob)]],
            [["Father's Name", student.father], ["Student Number", student.phone]],
            [["Gender", student.gender], ["CNIC", student.cnic]],
            [["Email Address", student.email], ["Address", student.address]],
            [["Course Name", student.course], ["Batch", student.batch]],
            [["Class Time", student.classTime], ["Roll No", student.rollNo]],
          ].map((row, i) => (
            <React.Fragment key={i}>
              <div className={i ? "border-t border-gray-800" : ""}><Cell label={row[0][0]} value={row[0][1]} /></div>
              <div className={i ? "border-t border-gray-800" : ""}><Cell label={row[1][0]} value={row[1][1]} /></div>
            </React.Fragment>
          ))}
        </div>

        {/* INSTRUCTIONS */}
        <div className="border border-gray-800 border-t-0 px-5 py-4">
          <p className="font-bold text-sm mb-2" style={{ color: BLUE }}>INSTRUCTIONS</p>
          <div className="grid grid-cols-2 gap-6 text-[10.5px] leading-4 text-gray-700">
            <div>
              <p>1 - Colour print your downloaded pdf file and bring it to Sir Adamjee Institute of Technology.</p>
              <p className="mt-1">2 - Come along with fees i.e. {student.amount} which is complete fees of the course. ( FEES IS NON REFUNDABLE )</p>
            </div>
            <div>
              <p>3 - Last date to submit form is mentioned by the institute. Proper classes will start in your selected timings.</p>
              <p className="mt-1">4 - We have very limited seats available so come in between 3pm to 9pm (Mon to Sat) to submit fees.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-500 my-4" />

        {/* ID CARDS */}
        <div className="flex justify-center gap-10">

          {/* FRONT */}
          <div className="w-[215px] h-[330px] rounded-md overflow-hidden relative" style={{ background: BLUE }}>
            <div className="bg-white h-[62%] rounded-b-[110px] flex flex-col items-center pt-5">
              <img src={saitLogo} alt="SAIT" className="h-12 w-auto object-contain" />
              <div className="w-24 h-24 rounded-full border-4 border-white shadow bg-slate-200 overflow-hidden mt-3">
                {student.photo && (
                  <img
                    src={student.photo}
                    alt=""
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <p className="text-white font-bold text-center text-base -mt-9 relative">{student.name}</p>

            <div className="absolute left-3 right-3 bottom-3 bg-white rounded-md p-3 text-[9.5px]">
              <p><span className="font-bold" style={{ color: BLUE }}>Roll No</span> <span className="float-right">{student.rollNo}</span></p>
              <p className="mt-1"><span className="font-bold" style={{ color: BLUE }}>Class time</span> <span className="float-right">{student.classTime}</span></p>
              <p className="mt-6 border-t border-gray-700 pt-1 text-right text-[10px]">Authorized Signature</p>
            </div>
          </div>

          {/* BACK */}
          <div className="w-[215px] h-[330px] rounded-md overflow-hidden relative bg-white border border-gray-300">
            <div className="h-[48%] flex justify-center pt-4 rounded-b-[110px]" style={{ background: BLUE }}>
              <div className="bg-white p-1.5 h-fit">
                <QRCodeSVG value={SAIT_WEBSITE} size={84} level="M" />
              </div>
            </div>

            <div className="px-4 pt-3 text-[9.5px] space-y-1">
              <img src={saitLogo} alt="SAIT" className="h-9 w-auto object-contain mx-auto mb-2" />
              <p><span className="font-bold" style={{ color: BLUE }}>Course Name</span> <span className="float-right">{student.course}</span></p>
              <p><span className="font-bold" style={{ color: BLUE }}>Batch</span> <span className="float-right">{student.batch}</span></p>
              <p><span className="font-bold" style={{ color: BLUE }}>Email</span> <span className="float-right">{student.email}</span></p>
              <p><span className="font-bold" style={{ color: BLUE }}>CNIC</span> <span className="float-right">{student.cnic}</span></p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 text-white text-center text-[7.5px] font-semibold py-1.5" style={{ background: BLUE }}>
              This card is only valid if it is attested by institute.
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-500 my-4" />

        {/* RECEIPT SLIP */}
        <div className="border border-gray-800">
          <div className="text-white text-center font-bold py-1.5 text-sm" style={{ background: BLUE }}>
            RECEIPT SLIP
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-5 py-4 text-[13px]">
            <p><b>Name</b> <span className="ml-3 border-b border-gray-700 inline-block min-w-[160px] text-center">{student.name}</span></p>
            <p><b>Course Name</b> <span className="ml-3 border-b border-gray-700 inline-block min-w-[130px] text-center">{student.course}</span></p>
            <p><b>Roll No.</b> <span className="ml-3 border-b border-gray-700 inline-block min-w-[160px] text-center">{student.rollNo}</span></p>
            <p><b>Date</b> <span className="ml-3 border-b border-gray-700 inline-block min-w-[160px]">&nbsp;</span></p>
            <p><b>Amount</b> <span className="ml-3 border-b border-gray-700 inline-block min-w-[160px] text-center">{student.amount}</span></p>
            <p><b>Authorized Signature</b> <span className="ml-3 border-b border-gray-700 inline-block min-w-[110px]">&nbsp;</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionCard;
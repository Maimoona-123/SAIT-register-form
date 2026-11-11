import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";
const MAX_PHOTO_MB = 2;

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#1F4E8C] focus:bg-white focus:ring-4 focus:ring-blue-100";

const initialData = {
  institute: "",
  course: "",
  fullName: "",
  guardian: "",
  email: "",
  phone: "",
  city: "",
  cnic: "",
  gender: "",
  dob: "",
  qualification: "",
  address: "",
};

const Label = ({ children }) => (
  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
    {children}
    <span className="text-red-500"> *</span>
  </label>
);

const Input = ({ label, ...props }) => (
  <div>
    <Label>{label}</Label>
    <input className={inputClass} required {...props} />
  </div>
);

// options: ["A", "B"] ya [{ value: "a", label: "A (extra text)" }]
const Select = ({ label, placeholder, options, ...props }) => (
  <div>
    <Label>{label}</Label>
    <select className={inputClass} required {...props}>
      <option value="">{placeholder}</option>
      {options.map((o) => {
        const value = typeof o === "string" ? o : o.value;
        const text = typeof o === "string" ? o : o.label;
        return (
          <option key={value} value={value}>
            {text}
          </option>
        );
      })}
    </select>
  </div>
);

const Section = ({ number, title, subtitle, children }) => (
  <section className="mb-10">
    <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1F4E8C] text-sm font-bold text-white">
        {number}
      </span>
      <div>
        <h2 className="text-lg font-bold leading-tight text-[#1F4E8C]">{title}</h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
    {children}
  </section>
);

const Registration = () => {
  const navigate = useNavigate();
  const [d, setD] = useState(initialData);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [courses, setCourses] = useState([]);
  const [coursesState, setCoursesState] = useState("loading"); // loading | ready | error

  const loadCourses = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/courses`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCourses(data);
      setCoursesState("ready");
      // Agar chuna hua course ab band ho gaya to selection hata do
      setD((p) => (data.some((c) => c.name === p.course) ? p : { ...p, course: "" }));
    } catch {
      setCoursesState("error");
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const change = (e) => setD((p) => ({ ...p, [e.target.name]: e.target.value }));

  const selectedCourse = courses.find((c) => c.name === d.course);

  const onPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setError(`Photo must be smaller than ${MAX_PHOTO_MB}MB.`);
      e.target.value = "";
      return;
    }

    setError("");
    setPhoto(file);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const body = new FormData();
      Object.entries(d).forEach(([key, value]) => body.append(key, value));
      body.append("photo", photo);

      const res = await fetch(`${API}/api/register`, { method: "POST", body });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      // Card ka data save karo aur card page par jao
      const card = { ...data.student, photo: `${API}${data.student.photo}` };
      sessionStorage.setItem("saitCard", JSON.stringify(card));
      navigate("/card");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to server. Please try again later."
          : err.message
      );
      loadCourses(); // course list dobara taza karo (seats bhar gayi ho sakti hain)
    } finally {
      setLoading(false);
    }
  };

  const courseOptions = courses.map((c) => ({
    value: c.name,
    label: `${c.name}  (${c.classTime})`,
  }));

  const coursePlaceholder =
    coursesState === "loading"
      ? "Loading courses..."
      : coursesState === "error"
      ? "Could not load courses"
      : courses.length === 0
      ? "No course is open right now"
      : "Select Course";

  return (
    <div className="pb-14">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#173b6c] via-[#1F4E8C] to-[#3a77cc] px-4 pb-28 pt-12 text-center text-white">
        <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full border-[36px] border-white/10" />
        <div className="absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-white/10" />

        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-[4px] text-blue-100">
            Admissions Open
          </span>
          <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">Student Registration</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-blue-100">
            Fill in the form below to register for a course. Your admission card
            will be ready to download right after you submit.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="relative z-10 mx-auto -mt-16 max-w-5xl px-4">
        <form
          onSubmit={submit}
          className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-300/50 md:p-10"
        >
          {/* 1. COURSE */}
          <Section number="1" title="Course Details" subtitle="Choose the course you want to join.">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3">
              <Select
                label="Institute"
                name="institute"
                value={d.institute}
                onChange={change}
                placeholder="Select Institute"
                options={["Sir Adamjee Institute of Technology"]}
              />
              <Select
                label="Course"
                name="course"
                value={d.course}
                onChange={change}
                placeholder={coursePlaceholder}
                options={courseOptions}
              />

              {/* Course chunne par uski days/timing apne aap yahan aa jati hai */}
              <div>
                <Label>Class Timing</Label>
                <input
                  className={`${inputClass} cursor-default bg-slate-100 text-slate-600`}
                  value={selectedCourse ? selectedCourse.classTime : ""}
                  placeholder="Select a course first"
                  readOnly
                  tabIndex={-1}
                />
              </div>
            </div>

            {selectedCourse && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[#1F4E8C]">
                  Fees: {selectedCourse.fees}
                </span>
                {selectedCourse.seatsLeft !== null && (
                  <span
                    className={`rounded-full px-3 py-1.5 ${
                      selectedCourse.seatsLeft <= 5
                        ? "bg-amber-50 text-amber-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    Seats left: {selectedCourse.seatsLeft}
                  </span>
                )}
              </div>
            )}
          </Section>

          {/* 2. PERSONAL */}
          <Section number="2" title="Personal Information" subtitle="Enter your details as on your CNIC / B-Form.">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3">
              <Input label="Full Name" name="fullName" value={d.fullName} onChange={change} placeholder="Enter your full name" />
              <Input label="Parents / Guardian Name" name="guardian" value={d.guardian} onChange={change} placeholder="Enter guardian name" />
              <Input label="CNIC / BForm" name="cnic" value={d.cnic} onChange={change} placeholder="4XXXXXXXXXXXXX" />

              <Select
                label="Gender"
                name="gender"
                value={d.gender}
                onChange={change}
                placeholder="Select Gender"
                options={["Male", "Female"]}
              />
              <Input label="Date of Birth" type="date" name="dob" value={d.dob} onChange={change} />
              <Select
                label="Last Qualification"
                name="qualification"
                value={d.qualification}
                onChange={change}
                placeholder="Select Qualification"
                options={["Matriculation", "Intermediate", "Bachelors", "Masters", "Other"]}
              />
            </div>
          </Section>

          {/* 3. CONTACT */}
          <Section number="3" title="Contact Details" subtitle="Write your email and number carefully.">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3">
              <Input label="Email" type="email" name="email" value={d.email} onChange={change} placeholder="abc123@gmail.com" />
              <Input label="Contact Number" type="tel" name="phone" value={d.phone} onChange={change} placeholder="03XXXXXXXXX" />
              <Input label="City Name" name="city" value={d.city} onChange={change} placeholder="Enter your city" />
            </div>
            <div className="mt-5">
              <Input label="Permanent Address" name="address" value={d.address} onChange={change} placeholder="House / street / area" />
            </div>
          </Section>

          {/* 4. PHOTO */}
          <Section number="4" title="Student Photograph" subtitle="Passport size, face front, decent picture (JPG or PNG).">
            <label className="flex cursor-pointer flex-col items-center gap-5 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/40 p-6 transition hover:border-[#1F4E8C] hover:bg-blue-50 sm:flex-row">
              <div className="flex h-32 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-300 bg-white">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="px-2 text-center text-xs text-slate-400">Photo preview</span>
                )}
              </div>

              <div className="text-center sm:text-left">
                <span className="inline-block rounded-lg bg-[#1F4E8C] px-5 py-2.5 text-sm font-semibold text-white">
                  {photo ? "Change Photo" : "Choose Photo"}
                </span>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  {photo ? photo.name : "No file chosen"}
                </p>
                <p className="mt-1 text-xs text-slate-500">Maximum size {MAX_PHOTO_MB}MB</p>
              </div>

              <input
                type="file"
                accept="image/png,image/jpeg"
                required
                onChange={onPhoto}
                className="sr-only"
              />
            </label>
          </Section>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || coursesState !== "ready" || courses.length === 0}
            className="w-full rounded-xl bg-gradient-to-r from-[#1F4E8C] to-[#2f6bc4] py-4 text-lg font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? "Submitting..." : "Submit & Get My Card"}
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            Sir Adamjee Institute of Technology • Learn • Practice • Grow
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
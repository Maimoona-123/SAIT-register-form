import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

const underline =
  "w-full bg-transparent border-0 border-b border-[#1F4E8C] py-2 text-sm outline-none focus:border-b-2 placeholder:text-gray-400";

const initialData = {
  institute: "",
  course: "",
  time: "",
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
  <label className="block text-[13px] font-bold text-gray-800 mb-1">
    {children}<span className="text-red-600">*</span>
  </label>
);

const Input = ({ label, ...props }) => (
  <div>
    <Label>{label}</Label>
    <input className={underline} required {...props} />
  </div>
);

const Select = ({ label, placeholder, options, ...props }) => (
  <div>
    <Label>{label}</Label>
    <select className={underline} required {...props}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

const Registration = () => {
  const navigate = useNavigate();
  const [d, setD] = useState(initialData);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const change = (e) => setD((p) => ({ ...p, [e.target.name]: e.target.value }));

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-md shadow-md px-6 md:px-14 py-8">
        <h1 className="text-center text-3xl text-[#1F4E8C] mb-10">
          Registration Form
        </h1>

        <form onSubmit={submit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-14 gap-y-8">
            <Select
              label="Institute"
              name="institute"
              value={d.institute}
              onChange={change}
              placeholder="Select Option"
              options={["Sir Adamjee Institute of Technology"]}
            />
            <Select
              label="Course"
              name="course"
              value={d.course}
              onChange={change}
              placeholder="Select Option"
              options={[
                "Office Automation",
                "Graphic Designing",
                "Digital Marketing",
                "Web & App Development",
                "Power BI",
              ]}
            />
            <Select
              label="Your Favourite Time ?"
              name="time"
              value={d.time}
              onChange={change}
              placeholder="Select Timing"
              options={["Morning", "Afternoon", "Evening"]}
            />

            <Input label="Full Name" name="fullName" value={d.fullName} onChange={change} />
            <Input label="Parents / Guardian Name" name="guardian" value={d.guardian} onChange={change} />
            <Input
              label="Email ( Write email carefully )"
              type="email"
              name="email"
              value={d.email}
              onChange={change}
              placeholder="abc123@gmail.com"
            />

            <Input
              label="Contact Number"
              type="tel"
              name="phone"
              value={d.phone}
              onChange={change}
              placeholder="03XXXXXXXXX"
            />
            <Input
              label="City Name"
              name="city"
              value={d.city}
              onChange={change}
              placeholder="Enter your city name"
            />
            <Input
              label="CNIC / BForm"
              name="cnic"
              value={d.cnic}
              onChange={change}
              placeholder="4XXXXXXXXXXXXX"
            />

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
              placeholder="Select Option"
              options={["Matriculation", "Intermediate", "Bachelors", "Masters", "Other"]}
            />
          </div>

          <div className="mt-8">
            <Input label="Permanent Address" name="address" value={d.address} onChange={change} />
          </div>

          <div className="mt-10">
            <label className="block text-[13px] font-bold text-gray-800 mb-2">
              Passport Size Profile Image (Face Front and Decent picture)
            </label>
            <div className="border border-dotted border-[#1F4E8C] p-5 w-full md:w-[70%]">
              <input
                type="file"
                accept="image/png,image/jpeg"
                required
                onChange={(e) => setPhoto(e.target.files[0])}
                className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#1F4E8C] file:text-white file:font-semibold file:cursor-pointer"
              />
            </div>
          </div>

          {error && (
            <div className="mt-8 text-center text-sm font-semibold rounded px-4 py-3 bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div className="flex justify-center mt-8 mb-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1F4E8C] hover:bg-[#173b6c] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-lg px-24 py-3 rounded transition"
            >
              {loading ? "Submitting..." : "Submit Form"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
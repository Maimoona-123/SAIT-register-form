import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-white shadow-sm px-6 py-3 flex items-center justify-between print:hidden">
    <Link to="/" className="flex items-center gap-3">
      <img
        src="/saitlogo.jpg"
        alt="SAIT Logo"
        className="h-14 w-auto object-contain"
      />
      <span className="font-bold text-[#1F4E8C] tracking-wide hidden md:block leading-tight">
        SIR ADAMJEE INSTITUTE
        <br />
        OF TECHNOLOGY
      </span>
    </Link>

    <div className="flex items-center gap-6 text-sm">
      {/* <Link to="/card" className="text-gray-500 hover:text-[#1F4E8C]">
        Download PDF
      </Link> */}
      <Link to="/" className="text-gray-900 font-medium">
        Registration
      </Link>
    </div>
  </nav>
);

export default Navbar;
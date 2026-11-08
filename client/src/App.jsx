import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Registration from "./pages/Registration/Registration";
import AdmissionCard from "./pages/AdmissionCard/AdmissionCard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/card" element={<AdmissionCard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
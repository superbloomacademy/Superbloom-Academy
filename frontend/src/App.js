import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Streams from "./pages/Streams";
import PharmacyStream from "./pages/PharmacyStream";
import EngineeringStream from "./pages/EngineeringStream";
import WhySuperbloom from "./pages/WhySuperbloom";
import CertificationCareers from "./pages/CertificationCareers";
import Contact from "./pages/Contact";
import Apply from "./pages/Admission";
import Careers from "./pages/Careers";
import JobDetails from "./pages/JobDetails";
import Admission from "./pages/Admission";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/streams" element={<Streams />} />
          <Route path="/streams/pharmacy" element={<PharmacyStream />} />
          <Route path="/streams/engineering" element={<EngineeringStream />} />
          <Route path="/why-superbloom" element={<WhySuperbloom />} />
          <Route
            path="/certification-careers"
            element={<CertificationCareers />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:id" element={<JobDetails />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

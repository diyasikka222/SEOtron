import React from "react";
import { Routes, Route } from "react-router-dom";

import { About } from "./components/About";
import { Cta } from "./components/Cta";
import { FAQ } from "./components/FAQ";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { Newsletter } from "./components/Newsletter";
import { Pricing } from "./components/Pricing";
import { ScrollToTop } from "./components/ScrollToTop";
import { Services } from "./components/Services";
import { Team } from "./components/Team";
import { Testimonials } from "./components/Testimonials";
import { Signup } from "./components/Signup";
import { BookDemo } from "./components/DemoPage";
import { SEOAnalyzer } from "./components/SEOanalyzer";
import { Login } from "./components/Login"; // ✅ Import Login page
import { ProtectedRoute } from "./components/ProtectedRoute"; // ✅ Import ProtectedRoute

import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <About />
              <HowItWorks />
              <Features />
              <Services />
              <Cta />
              <Testimonials />
              <Team />
              <Pricing />
              <Newsletter />
              <FAQ />
              <Footer />
              <ScrollToTop />
            </>
          }
        />

        {/* Auth routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Other pages */}
        <Route path="/book-demo" element={<BookDemo />} />

        {/* ✅ Protected SEO Analyzer page */}
        <Route
          path="/analyze"
          element={
            <ProtectedRoute>
              <SEOAnalyzer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

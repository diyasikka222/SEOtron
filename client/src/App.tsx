import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

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
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Onboarding from "./components/Onboarding";

import "./App.css";
import DashboardDeep from "./components/Dashboard";

interface Props {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<Props> = ({ children }) => {
  // ✨ FIX: Check for "token" instead of "user"
  const token = localStorage.getItem("token");

  if (token) {
    // This will now correctly redirect if a token exists
    return <Navigate to="/deepdashboard" />;
  }
  return <>{children}</>;
};

function App() {
  const { pathname } = useLocation();
  const showNavbar = pathname === "/";

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        {/* Landing Page - PublicRoute wraps it */}
        <Route
          path="/"
          element={
            <PublicRoute>
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
            </PublicRoute>
          }
        />

        {/* ✅ Onboarding Route (Public) */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Auth Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Other Public Pages */}
        <Route path="/book-demo" element={<BookDemo />} />

        {/* ✅ Protected Pages */}
        <Route
          path="/analyze"
          element={
            <ProtectedRoute>
              <SEOAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deepdashboard"
          element={
            <ProtectedRoute>
              <DashboardDeep />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

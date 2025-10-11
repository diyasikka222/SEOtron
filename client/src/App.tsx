import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
import Dashboard from "./components/Dashboard";

import "./App.css";

// ✅ PublicRoute component
interface Props {
    children: React.ReactNode;
}

export const PublicRoute: React.FC<Props> = ({ children }) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (user) {
        return <Navigate to="/analyze" />;
    }
    return <>{children}</>;
};


function App() {
    return (
        <>
            <Navbar />

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

                {/* Auth Routes */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />

                {/* Other Public Pages */}
                <Route path="/book-demo" element={<BookDemo />} />

                {/* Protected Page */}
                <Route
                    path="/analyze"
                    element={
                        <ProtectedRoute>
                            <SEOAnalyzer />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>

        </>
    );
}

export default App;

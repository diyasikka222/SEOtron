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
        <Route path="/signup" element={<Signup />} />
        <Route path="/book-demo" element={<BookDemo />} />
      </Routes>
    </>
  );
}

export default App;

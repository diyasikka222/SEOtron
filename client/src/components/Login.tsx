import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { loginUser } from "../api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import DotGrid from "./DotGrid";

export const Login = () => {
  const navigate = useNavigate();

  // -------------------------
  // Form state
  // -------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -------------------------
  // Handle form submission
  // -------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser({ email, password }); // API call
      navigate("/analyze"); // redirect to SEO Analyzer
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full flex flex-col items-center justify-center min-h-screen py-20 overflow-hidden">
      {/* DotGrid now fills the full-width section */}
      <div className="absolute inset-0 z-0">
        <DotGrid
          dotSize={3}
          gap={15}
          baseColor="#303030"
          activeColor="#61DAFB"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* container div for content */}
      <div className="container relative z-10 flex flex-col items-center justify-center">
        {/* h1 and Card inside the new container */}
        <h1 className="text-6xl font-extrabold mb-12 bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] bg-clip-text text-transparent">
          SEOtron
        </h1>

        <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl bg-black/80 backdrop-blur border border-white/10">
          <CardHeader className="relative text-center space-y-2">
            <Link to="/" className="absolute top-0 left-0">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                &larr; Go Home
              </Button>
            </Link>

            {/* ✨ MODIFIED: Added pt-10 */}
            <CardTitle className="text-3xl font-bold pt-10">
              Log In to Your Account
            </CardTitle>
            <p className="text-muted-foreground">
              Enter your credentials to continue
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
                required
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-black font-semibold"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Log In"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <a href="/signup" className="text-[#61DAFB] hover:underline">
                Sign Up
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// ✨ 1. Import loginUser in addition to signupUser
// ✨ FIX: Path changed to ../api (assuming api.ts is in src/)
import { signupUser, loginUser } from "../api";

// ✨ FIX: Path changed to ./ui/ (assuming ui folder is inside components/)
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// ✨ FIX: Path changed to ./ (assuming DotGrid is inside components/)
import DotGrid from "./DotGrid";

export const Signup = () => {
  const navigate = useNavigate();

  // -------------------------
  // Form state
  // -------------------------
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -------------------------
  // Handle form submission
  // -------------------------
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 2. First, create the user
      await signupUser({ username: fullName, email, password });

      // 3. If signup is successful, immediately log the user in
      const loginResponse = await loginUser({ email, password });

      // 4. Check for token and onboarding status from the login response
      // (Your api.ts already saves the token in localStorage)
      if (loginResponse && loginResponse.access_token) {
        if (loginResponse.isOnboarded) {
          // User is already onboarded
          navigate("/deepdashboard");
        } else {
          // New user, send to onboarding
          navigate("/onboarding");
        }
      } else {
        // This shouldn't happen if login is successful, but as a fallback
        throw new Error("Signup succeeded, but auto-login failed.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full flex flex-col items-center justify-center min-h-screen py-20 overflow-hidden">
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

      <h1 className="relative z-10 text-6xl font-extrabold mb-12 bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] bg-clip-text text-transparent">
        SEOtron
      </h1>

      <Card className="relative z-10 w-full max-w-md p-6 shadow-xl rounded-2xl bg-black/80 backdrop-blur border border-white/10">
        <CardHeader className="relative text-center space-y-2">
          <Link to="/" className="absolute top-0 left-0">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              &larr; Go Home
            </Button>
          </Link>

          <CardTitle className="text-3xl font-bold pt-10">
            <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
              Create
            </span>{" "}
            Your Account
          </CardTitle>
          <p className="text-muted-foreground">
            Join us and take your business to new heights
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
              required
            />
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
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-[#61DAFB] hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api"; // ✅ Import API function
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
      const res = await signupUser({ username: fullName, email, password });
      alert(res.message);           // show success message
      navigate("/analyze");           // redirect to login page
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container flex items-center justify-center min-h-screen py-20">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl bg-black/80 backdrop-blur border border-white/10">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">
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
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-[#61DAFB] hover:underline">
              Log in
            </a>
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

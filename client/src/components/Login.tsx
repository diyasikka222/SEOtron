import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api"; // ✅ Import API function
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
      navigate("/analyze");                 // redirect to SEO Analyzer
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container flex items-center justify-center min-h-screen py-20">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl bg-black/80 backdrop-blur border border-white/10">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">
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
    </section>
  );
};

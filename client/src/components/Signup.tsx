import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const Signup = () => {
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
          <Input
            type="text"
            placeholder="Full Name"
            className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
          />
          <Input
            type="email"
            placeholder="Email"
            className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
          />
          <Input
            type="password"
            placeholder="Password"
            className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
          />

          <Button className="w-full bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-black font-semibold">
            Sign Up
          </Button>

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

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import DotGrid from "./DotGrid";

export const BookDemo = () => {
  const [date, setDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "email" | "done">("select");
  const [email, setEmail] = useState("");

  const availableSlots = [
    "10:00 AM - 10:30 AM",
    "11:30 AM - 12:00 PM",
    "2:00 PM - 2:30 PM",
    "4:00 PM - 4:30 PM",
  ];

  const handleNext = () => {
    if (!date || !selectedSlot) {
      alert("Please select a date and a time slot!");
      return;
    }
    setStep("email");
  };

  const handleConfirm = () => {
    if (!email) {
      alert("Please provide your email!");
      return;
    }
    setStep("done");
  };

  return (
    // ✨ 1. MODIFIED: Added `flex flex-col`
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

      {/* ✨ 2. ADDED: SEOtron Title */}
      <h1 className="relative z-10 text-6xl font-extrabold mb-12 bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] bg-clip-text text-transparent">
        SEOtron
      </h1>

      <Card className="relative z-10 w-full max-w-lg p-6 shadow-xl rounded-2xl bg-black/80 backdrop-blur border border-white/10">
        <CardHeader className="relative text-center">
          <Link to="/" className="absolute top-0 left-0">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              &larr; Go Home
            </Button>
          </Link>

          <CardTitle className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
              Book a Free Demo
            </span>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {step === "select" && "Select your preferred date & time slot 📅"}
            {step === "email" &&
              "Provide your email to receive Google Meet link ✉️"}
            {step === "done" && "🎉 Booking Confirmed"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "select" && (
            <>
              {/* Calendar Section */}
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>

              {/* Time Slots */}
              {date && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">
                    Available Slots for {format(date, "PPP")}:
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? "default" : "outline"}
                        className={`${
                          selectedSlot === slot
                            ? "bg-gradient-to-r from-[#61DAFB] to-[#03a3d7] text-black"
                            : "border-white text-white hover:bg-white hover:text-black"
                        }`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Button */}
              <Button
                className="w-full bg-gradient-to-r from-[#F596D3] to-[#D247BF] font-semibold"
                onClick={handleNext}
              >
                Continue
              </Button>
            </>
          )}

          {step === "email" && (
            <>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/40 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button
                className="w-full bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] font-semibold"
                onClick={handleConfirm}
              >
                Confirm Booking
              </Button>
            </>
          )}

          {step === "done" && (
            <div className="text-center space-y-3">
              <p className="text-lg text-white">
                ✅ Demo booked on <br />
                <span className="font-semibold">
                  {date && format(date, "PPP")} at {selectedSlot}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                A Google Meet link will be sent to <strong>{email}</strong>.
              </p>
              <br />
              <Link to="/">
                <Button>Go to Home Page</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

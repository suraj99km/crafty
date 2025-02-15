"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-500 p-6">
      
      {/* Login Card */}
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-lg bg-white mt-18">
        <h4 className="text-center text-xl font-semibold text-gray-800 mb-6">Enter your mobile number</h4>
        
        {step === 1 ? (
          <div className="space-y-6">
            <PhoneInput
              country={"in"} // Default country code set to +91 for India
              value={phone}
              onChange={(value) => setPhone(value)}
              inputClass="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
              containerClass="w-full"
              disableDropdown
              inputStyle={{ borderRadius: "10px", width: "100%", height: "45px", padding: "10px" }}
            />
            <Button
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
              onClick={() => setStep(2)}
              disabled={loading || phone.length < 10}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
              onClick={() => alert("OTP Submitted!")}
              disabled={loading || otp.length < 4}
            >
              {loading ? "Verifying..." : "Login"}
            </Button>
          </div>
        )}

        <div className="my-6 text-center text-gray-500">OR</div>

        <Button className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg bg-white shadow hover:bg-gray-50 transition duration-300">
          <FaGoogle className="text-red-500" /> Sign in with Google
        </Button>

        <Button className="w-full mt-4 p-3 border border-gray-300 rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-300">
          Sign in with Email
        </Button>
      </Card>
    </div>
  );
}

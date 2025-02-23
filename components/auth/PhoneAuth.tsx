"use client";

import { useState } from "react";
import supabase from '@/lib/supabase/supabaseClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { MdSms } from "react-icons/md";

export default function PhoneAuth() {
  const [phone, setPhone] = useState("+91 ");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Send OTP
  const sendOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });

    if (error) {
      alert("Error sending OTP: " + error.message);
    } else {
      setStep(2);
    }
    setLoading(false);
  };

  // Verify OTP
  const verifyOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });

    if (error) {
      alert("Error verifying OTP: " + error.message);
    } else {
      alert("Phone number verified successfully!");
    }
    setLoading(false);
  };

  return (
    <div className="">
      {step === 1 ? (
        <>

        <PhoneInput
        country={"in"}
        value={phone}
        onChange={(value) => setPhone(value)} // No forced "+91"
        inputClass="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 pl-18"
        containerClass="w-full relative"
        disableDropdown
        inputStyle={{
            borderRadius: "5px",
            width: "100%",
            height: "45px",
            paddingLeft: "50px", // Avoids overlap
        }}
        />
          <Button
            className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
            onClick={sendOtp}
            disabled={loading || phone.length < 12}
          >
            <MdSms className="text-white text-lg" /> {loading ? "Sending..." : "Get OTP on SMS"}
          </Button>
        </>
      ) : (
        <>
          <Input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
            onClick={verifyOtp}
            disabled={loading || otp.length < 4}
          >
            {loading ? "Verifying..." : "Login"}
          </Button>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import supabase from '@/lib/supabase-db/supabaseClient';
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { MdSms } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai"; // Green checkmark icon

export default function PhoneAuth({ onVerified }: { onVerified: (verified: boolean) => void }) {
  const [phone, setPhone] = useState("+91 ");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [isVerified, setIsVerified] = useState(false); // ✅ Tracks verification status

  // Send OTP
  const sendOtp = async () => {
    setLoading(true);
    setPhoneError(""); // Clear previous errors

    const { error } = await supabase.auth.signInWithOtp({ phone });

    if (error) {
      setPhoneError("Error sending OTP: " + error.message);
    } else {
      setStep(2);
    }
    setLoading(false);
  };

  // Verify OTP
  const verifyOtp = async () => {
    setLoading(true);
    setPhoneError(""); // Clear previous errors

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });

    if (error) {
      setPhoneError("Error verifying OTP: " + error.message);
      setIsVerified(false);
      onVerified(false); // Inform parent form that verification failed
    } else {
      setIsVerified(true);
      onVerified(true); // Inform parent form that phone is verified
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className={`flex items-center gap-2 border ${isVerified ? "border-green-500" : "border-gray-300"} rounded-lg p-2 shadow-sm focus-within:ring-2 focus-within:ring-red-500`}>
        <PhoneInput
          country={"in"}
          value={phone}
          onChange={(value) => setPhone(value)}
          inputClass="w-full border-none outline-none"
          containerClass="flex-1"
          disableDropdown
          inputStyle={{
            border: "none",
            width: "100%",
            height: "30px",
            paddingLeft: "50px",
            background: "transparent",
          }}
          disabled={isVerified} // ✅ Disable input if verified
        />
        {step === 1 ? (
          <Button
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
            onClick={sendOtp}
            disabled={loading || phone.length < 12}
          >
            <MdSms className="text-white text-lg" />
            <span className="font-bold">Verify</span>
          </Button>
        ) : (
          <input
            type="text"
            className="w-24 border-none outline-none text-center"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={isVerified} // ✅ Disable OTP input if verified
          />
        )}
        {step === 2 && !isVerified && (
          <Button
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
            onClick={verifyOtp}
            disabled={loading || otp.length < 4}
          >
            ✔
          </Button>
        )}

        {/* ✅ Show success indicator when verified */}
        {isVerified && (
          <div className="flex items-center gap-1 text-green-600 font-medium">
            <AiOutlineCheckCircle size={20} />
            <span>Verified</span>
          </div>
        )}
      </div>

      {/* Error Message Below Input */}
      {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { MdSms } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Loader2 } from "lucide-react";
import { sendOTP, verifyOTP } from "@/lib/sms-service/twoFactor";

export default function PhoneAuth({ onVerified }: { onVerified: (verified: boolean) => void }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [sessionId, setSessionId] = useState("");

  // Send OTP
  const handleSendOtp = async () => {
    setLoading(true);
    setError("");

    const formattedPhone = phone.replace(/[^0-9]/g, "");
    const result = await sendOTP(formattedPhone);

    if (result.success) {
      setSessionId(result.sessionId);
      setStep(2);
    } else {
      setError(result.error || "Failed to send OTP");
    }
    setLoading(false);
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");

    const result = await verifyOTP(sessionId, otp);

    if (result.success) {
      setIsVerified(true);
      onVerified(true);
    } else {
      setError(result.error || "Invalid OTP");
      setIsVerified(false);
      onVerified(false);
    }
    setLoading(false);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-600 font-medium">Phone Number</label>
        <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ${isVerified ? 'opacity-75' : ''}`}>
          <div className={`flex-1 border ${isVerified ? "border-green-500" : "border-gray-300"} rounded-lg p-2 shadow-sm focus-within:ring-2 focus-within:ring-red-500`}>
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
                height: "36px",
                paddingLeft: "50px",
                background: "transparent",
                fontSize: "16px",
              }}
              disabled={isVerified || loading}
            />
          </div>
          
          {step === 1 ? (
            <Button
              className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 h-[42px] rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleSendOtp}
              disabled={loading || phone.length < 12}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <MdSms className="text-white text-xl" />
                  <span>Send OTP</span>
                </>
              )}
            </Button>
          ) : null}
        </div>
      </div>

      {step === 2 && !isVerified && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600 font-medium">Enter OTP</label>
          <p className="text-xs text-gray-500">
            A verification code has been sent to {phone}
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-center text-lg tracking-wider"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={6}
              disabled={isVerified || loading}
            />
            <Button
              className="w-full sm:w-auto bg-red-500 text-white px-6 py-2 h-[42px] rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 6}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verify OTP"
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Didn't receive OTP? {" "}
            <button 
              onClick={handleSendOtp} 
              disabled={loading}
              className="text-red-500 hover:text-red-600 disabled:opacity-50"
            >
              Resend
            </button>
          </p>
        </div>
      )}

      {isVerified && (
        <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 p-3 rounded-lg">
          <AiOutlineCheckCircle size={16} />
          <span className="text-xs">Phone number verified successfully</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}

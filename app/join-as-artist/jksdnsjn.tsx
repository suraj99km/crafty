"use client";

import { useState } from "react";
import PhoneAuth from "@/components/auth/PhoneAuth"; // Adjust the import path if needed
import { AiOutlineCheckCircle } from "react-icons/ai"; 

export default function TestPage() {
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="mt-20 max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Phone Verification</h2>

      {/* PhoneAuth Component */}
      <PhoneAuth 
        onVerified={(status: boolean) => {
          setIsPhoneVerified(status);
          if (status) {
            setPhoneNumber("verified-phone-number"); // Replace with actual phone number
          }
        }} 
      />

      {/* Display verified phone number and green check mark if verified */}
      {isPhoneVerified && phoneNumber && (
        <div className="mt-4 p-3 border border-gray-300 rounded-md flex items-center gap-2 bg-gray-100">
          <span className="text-gray-600 font-medium">{phoneNumber}</span>
          <div className="flex items-center gap-1 text-green-600">
            <AiOutlineCheckCircle size={20} />
            <span>Verified</span>
          </div>
        </div>
      )}
    </div>
  );
}

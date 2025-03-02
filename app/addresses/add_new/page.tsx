"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase-db/supabaseClient";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Address = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  pincode: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
};

export default function AddNewAddress() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; firstName: string; lastName: string } | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    state: "",
    city: "",
    pincode: "",
    address_line1: "",
    address_line2: "",
    landmark: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setUser(null);
        return;
      }

      const fullName =
        data.user.user_metadata?.full_name ||
        data.user.user_metadata?.display_name ||
        data.user.user_metadata?.name ||
        "User";

      const firstName = fullName.split(" ")[0] || "";
      const lastName = fullName.split(" ")[1] || "";
      const email = data.user.email || "";
      const id = data.user.id;

      setUser({ id, firstName, lastName, email });

      setNewAddress((prev) => ({
        ...prev,
        first_name: firstName,
        last_name: lastName,
        email: email,
      }));
    };

    getUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Ensure only numbers for phone and pincode
    if ((name === "phone" || name === "pincode") && !/^\d*$/.test(value)) return;

    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = async () => {
    if (!/^\d{10}$/.test(newAddress.phone)) {
      alert("Phone number must be exactly 10 numeric digits.");
      return;
    }

    if (!/^\d{6}$/.test(newAddress.pincode)) {
      alert("Pincode must be exactly 6 numeric digits.");
      return;
    }

    if (!newAddress.first_name || !newAddress.phone || !newAddress.state || !newAddress.city || !newAddress.pincode || !newAddress.address_line1) {
      alert("Please fill all required fields.");
      return;
    }

    console.log("Saving address:", newAddress); // Debug log

    const { error, data } = await supabase.from("user_information").upsert([
      {
        user_id: user?.id, // Ensure the user ID is passed
        ...newAddress,
      },
    ]);

    console.log("Supabase response:", { data, error }); // Debug log

    if (error) {
      alert("Failed to save address. Please try again.");
      console.error("Error saving address:", error);
    } else {
      alert("Address saved successfully!");
      router.push("/addresses");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Header with Back Button */}
      <div className="w-full max-w-2xl mt-20">
        <div className="relative flex items-center">
          <button
            onClick={() => router.back()}
            className="absolute left-0 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition-all duration-200"
          >
            <ChevronLeft size={20} className="text-gray-800" />
          </button>
          <h2 className="text-xl font-semibold text-center w-full">Add New Address</h2>
        </div>
      </div>

      {/* Form Card */}
      <Card className="w-full max-w-2xl mt-4 shadow-lg rounded-xl bg-white">
        <CardContent className="p-6 space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="first_name" value={newAddress.first_name} onChange={handleChange} placeholder="First Name" className="input-field" />
            <input type="text" name="last_name" value={newAddress.last_name} onChange={handleChange} placeholder="Last Name" className="input-field" />
          </div>

          {/* Email */}
          <input type="email" name="email" value={newAddress.email} onChange={handleChange} placeholder="Email" className="input-field" />

          {/* Phone Number */}
          <input type="text" name="phone" value={newAddress.phone} onChange={handleChange} placeholder="Phone Number" className="input-field" maxLength={10} />

          {/* Address Fields */}
          <input type="text" name="address_line1" value={newAddress.address_line1} onChange={handleChange} placeholder="Address Line 1" className="input-field" />
          <input type="text" name="address_line2" value={newAddress.address_line2} onChange={handleChange} placeholder="Address Line 2 (Optional)" className="input-field" />
          <input type="text" name="landmark" value={newAddress.landmark} onChange={handleChange} placeholder="Landmark (Optional)" className="input-field" />

          {/* City, Pincode, and State */}
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="city" value={newAddress.city} onChange={handleChange} placeholder="City" className="input-field" />
            <input type="text" name="state" value={newAddress.state} onChange={handleChange} placeholder="State" className="input-field" />
          </div>

          <input type="text" name="pincode" value={newAddress.pincode} onChange={handleChange} placeholder="Pincode" className="input-field" maxLength={6} />

          {/* Save Button */}
          <button
            onClick={handleSaveAddress}
            className="w-full text-lg bg-red-500 font-semibold text-white p-3 rounded-lg hover:bg-red-600 transition duration-200 shadow-md hover:shadow-lg"
          >
            Save Address
          </button>
        </CardContent>
      </Card>

      {/* Styles */}
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
          transition: all 0.2s ease-in-out;
          font-size: 16px;
        }
        .input-field:focus {
          border-color: #ef4444;
          box-shadow: 0 0 6px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
}

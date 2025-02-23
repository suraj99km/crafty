"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/supabaseClient";
import { ChevronLeft } from "lucide-react";

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

    // Handle back navigation
    const handleBack = () => {
        router.back();
      };

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 bg-white shadow-lg rounded-xl border border-gray-200 text-center">
    {/* Header with Back Button */}
    <div className="relative flex justify-center items-center mb-4">
    <button
        onClick={handleBack}
        className="absolute left-0 bg-white rounded-full p-3 shadow-sm hover:bg-gray-100 transition-all duration-200"
    >
        <ChevronLeft size={24} className="text-gray-800" />
    </button>
    <h2 className="text-xl font-semibold">Add New Address</h2>
    </div>


      {/* First Name & Last Name */}
      <div className="flex space-x-3">
        <input
          type="text"
          name="first_name"
          value={newAddress.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="text"
          name="last_name"
          value={newAddress.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Email */}
      <input
        type="email"
        name="email"
        value={newAddress.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-3 border rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      {/* Phone Number */}
      <input
        type="text"
        name="phone"
        value={newAddress.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full p-3 border rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-red-500"
        maxLength={10}
      />

      {/* Address Line 1 */}
      <input
        type="text"
        name="address_line1"
        value={newAddress.address_line1}
        onChange={handleChange}
        placeholder="Address Line 1"
        className="w-full p-3 border rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      {/* Address Line 2 */}
      <input
        type="text"
        name="address_line2"
        value={newAddress.address_line2}
        onChange={handleChange}
        placeholder="Address Line 2 (Optional)"
        className="w-full p-3 border rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      {/* Landmark + City */}
      <div className="flex space-x-3 mt-3">
        <input
          type="text"
          name="landmark"
          value={newAddress.landmark}
          onChange={handleChange}
          placeholder="Landmark (Optional)"
          className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="text"
          name="city"
          value={newAddress.city}
          onChange={handleChange}
          placeholder="City"
          className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Pincode + State */}
      <div className="flex space-x-3 mt-3">
        <input
          type="text"
          name="pincode"
          value={newAddress.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          maxLength={6}
        />
        <input
          type="text"
          name="state"
          value={newAddress.state}
          onChange={handleChange}
          placeholder="State"
          className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveAddress}
        className="w-full text-lg bg-red-500 font-semibold text-white p-3 rounded-lg hover:bg-red-600 transition duration-200 mt-5 shadow-md hover:shadow-lg"
      >
        Save Address
      </button>
    </div>
  );
}

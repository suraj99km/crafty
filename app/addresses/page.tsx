"use client";

import { useEffect, useState } from "react";
import supabase from "@/db/supabaseClient";

type Address = {
  id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  pincode: string;
  address_line1: string;
  address_line2?: string;
};

export default function SavedAddresses() {
  const [user, setUser] = useState<{ id: string; email: string; firstName: string; lastName: string } | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
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

      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setUser({ id: data.user.id, email: data.user.email, firstName, lastName });

      setNewAddress((prev) => ({
        ...prev,
        first_name: firstName,
        last_name: lastName,
        email: data.user.email || "",
      }));

      // Fetch existing addresses
      const { data: userInfo, error: userError } = await supabase
        .from("user_information")
        .select("*")
        .eq("id", data.user.id);

      if (!userError && userInfo.length > 0) {
        setAddresses(userInfo);
      }
    };

    getUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = async () => {
    if (addresses.length >= 3) {
      alert("You can only save up to 3 addresses.");
      return;
    }

    if (!newAddress.first_name || !newAddress.phone || !newAddress.state || !newAddress.city || !newAddress.pincode || !newAddress.address_line1) {
      alert("Please fill all required fields.");
      return;
    }

    const { data, error } = await supabase.from("user_information").upsert([
      {
        id: user?.id,
        ...newAddress,
      },
    ]);

    if (error) {
      alert("Failed to save address. Please try again.");
      console.error(error);
    } else {
      setAddresses([...addresses, newAddress]);
      setNewAddress((prev) => ({
        ...prev,
        phone: "",
        state: "",
        city: "",
        pincode: "",
        address_line1: "",
        address_line2: "",
      }));
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>

      {addresses.map((addr, index) => (
        <div key={index} className="p-3 mb-4 border rounded-lg">
          <p><strong>{addr.first_name} {addr.last_name}</strong></p>
          <p>{addr.address_line1}, {addr.address_line2}</p>
          <p>{addr.city}, {addr.state} - {addr.pincode}</p>
          <p>📞 {addr.phone}</p>
          <p>📧 {addr.email}</p>
        </div>
      ))}

      {addresses.length < 3 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Add New Address</h3>

          <div className="flex space-x-2">
            <input type="text" name="first_name" value={newAddress.first_name} disabled className="w-1/2 p-2 border rounded mb-3 bg-gray-200" />
            <input type="text" name="last_name" value={newAddress.last_name} disabled className="w-1/2 p-2 border rounded mb-3 bg-gray-200" />
          </div>
          <input type="email" name="email" value={newAddress.email} disabled className="w-full p-2 border rounded mb-3 bg-gray-200" />
          <input type="text" name="phone" value={newAddress.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded mb-3" />
          <input type="text" name="state" value={newAddress.state} onChange={handleChange} placeholder="State" className="w-full p-2 border rounded mb-3" />
          <input type="text" name="city" value={newAddress.city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded mb-3" />
          <input type="text" name="pincode" value={newAddress.pincode} onChange={handleChange} placeholder="Pincode" className="w-full p-2 border rounded mb-3" />
          <input type="text" name="address_line1" value={newAddress.address_line1} onChange={handleChange} placeholder="Address Line 1" className="w-full p-2 border rounded mb-3" />
          <input type="text" name="address_line2" value={newAddress.address_line2} onChange={handleChange} placeholder="Address Line 2 (Optional)" className="w-full p-2 border rounded mb-3" />

          <button
            onClick={handleSaveAddress}
            className="w-full text-lg bg-red-500 font-semibold text-white p-2 rounded-md hover:bg-red-600 transition duration-150"
            >
            Save Address
            </button>

        </div>
      )}
    </div>
  );
}

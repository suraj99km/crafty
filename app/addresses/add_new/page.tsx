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

  const [errors, setErrors] = useState<Partial<Address>>({});

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;

      const fullName = data.user.user_metadata?.full_name || "User";
      const firstName = fullName.split(" ")[0] || "";
      const lastName = fullName.split(" ")[1] || "";
      const email = data.user.email || "";

      setUser({ id: data.user.id, firstName, lastName, email });

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
    if ((name === "phone" || name === "pincode") && !/^\d*$/.test(value)) return;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let newErrors: Partial<Address> = {};
    if (!newAddress.first_name) newErrors.first_name = "First name is required.";
    if (!/^\d{10}$/.test(newAddress.phone)) newErrors.phone = "Phone number must be exactly 10 digits.";
    if (!/^\d{6}$/.test(newAddress.pincode)) newErrors.pincode = "Pincode must be exactly 6 digits.";
    if (!newAddress.state) newErrors.state = "State is required.";
    if (!newAddress.city) newErrors.city = "City is required.";
    if (!newAddress.address_line1) newErrors.address_line1 = "Address Line 1 is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;
  
    const { error } = await supabase.from("user_information").upsert([
      { user_id: user?.id, ...newAddress },
    ]);
  
    if (error) {
      alert("Failed to save address. Please try again.");
    } else {
      alert("Address saved successfully!");
      router.back(); // Redirects to the previous page instead of a fixed route
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
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

      <Card className="w-full max-w-2xl mt-4 shadow-lg rounded-xl bg-white">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input type="text" name="first_name" value={newAddress.first_name} onChange={handleChange} placeholder="First Name" className="input-field" />
              {errors.first_name && <p className="error-text">{errors.first_name}</p>}
            </div>
            <input type="text" name="last_name" value={newAddress.last_name} onChange={handleChange} placeholder="Last Name" className="input-field" />
          </div>

          <input type="email" name="email" value={newAddress.email} onChange={handleChange} placeholder="Email" className="input-field" />

          <div>
            <input type="text" name="phone" value={newAddress.phone} onChange={handleChange} placeholder="Phone Number" className="input-field" maxLength={10} />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          <div>
            <input type="text" name="address_line1" value={newAddress.address_line1} onChange={handleChange} placeholder="Address Line 1" className="input-field" />
            {errors.address_line1 && <p className="error-text">{errors.address_line1}</p>}
          </div>

          <input type="text" name="address_line2" value={newAddress.address_line2} onChange={handleChange} placeholder="Address Line 2 (Optional)" className="input-field" />
          <input type="text" name="landmark" value={newAddress.landmark} onChange={handleChange} placeholder="Landmark (Optional)" className="input-field" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input type="text" name="city" value={newAddress.city} onChange={handleChange} placeholder="City" className="input-field" />
              {errors.city && <p className="error-text">{errors.city}</p>}
            </div>
            <div>
              <input type="text" name="state" value={newAddress.state} onChange={handleChange} placeholder="State" className="input-field" />
              {errors.state && <p className="error-text">{errors.state}</p>}
            </div>
          </div>

          <div>
            <input type="text" name="pincode" value={newAddress.pincode} onChange={handleChange} placeholder="Pincode" className="input-field" maxLength={6} />
            {errors.pincode && <p className="error-text">{errors.pincode}</p>}
          </div>

          <button
            onClick={handleSaveAddress}
            className="w-full text-lg bg-red-500 font-semibold text-white p-3 rounded-lg hover:bg-red-600 transition duration-200 shadow-md hover:shadow-lg"
          >
            Save Address
          </button>
        </CardContent>
      </Card>

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
        .error-text {
          color: red;
          font-size: 14px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
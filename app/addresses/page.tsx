"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/supabaseClient";
import AddressCard from "@/components/users/AddressCard";
import { ChevronRight } from "lucide-react";
import { Address } from "@/Types"; // Import Address type

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAddresses = async () => {
      const { data, error } = await supabase
        .from("user_information")
        .select("*");

      if (!error && data) {
        setAddresses(data as Address[]);
      }
    };

    fetchAddresses();
  }, []);

  // Function to remove the deleted address from UI
  const handleDeleteAddress = (id: number) => {
    setAddresses((prev) => prev.filter((address) => address.id !== id));
  };

  return (
    <div className="h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl mt-16 p-6 bg-white rounded-lg">
        
        {/* Add New Address Button */}
        <button
          onClick={() => router.push("/addresses/add_new")}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium shadow-sm hover:bg-gray-100 transition duration-200"
        >
          <span className="text-lg">Add New Address</span>
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </button>

        {/* Section Heading */}
        <h2 className="text-2xl font-semibold text-center mt-8">Saved Addresses</h2>

        {/* Address List */}
        <div className="my-6 pb-4 space-y-4 overflow-y-auto max-h-[70vh] px-2 w-full">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <AddressCard key={address.id} address={address} onDelete={handleDeleteAddress} />
            ))
          ) : (
            <p className="text-gray-500 text-center mt-4">No saved addresses found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

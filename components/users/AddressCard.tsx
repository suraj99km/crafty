import { MapPin, Phone, Trash2, Mail } from "lucide-react";
import { Address } from "@/Types"; // Import Address type
import supabase from "@/lib/supabase/supabaseClient";

interface AddressCardProps {
  address: Address;
  onDelete: (id: number) => void; // Function to handle deletion
}

export default function AddressCard({ address, onDelete }: AddressCardProps) {
  // Handle delete function
  const handleDelete = async () => {
    const { error } = await supabase
      .from("user_information")
      .delete()
      .match({ id: address.id });

    if (!error) {
      onDelete(address.id); // Remove the card from UI after successful deletion
    } else {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg relative">
      {/* Name & Phone */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {address.first_name} {address.last_name}
        </h3>
        <div className="flex items-center text-gray-500 text-sm">
          <Phone className="h-4 w-4 mr-1" />
          {address.phone}
        </div>
      </div>

      {/* Address Info with Landmark */}
      <p className="text-gray-600 mt-3 flex items-start">
        <MapPin className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
        <span>
          {address.address_line1}, {address.address_line2 && `${address.address_line2}, `}
          {address.landmark && `near ${address.landmark}, `}
          {address.city}, {address.state} - {address.pincode}
        </span>
      </p>

      {/* Email & Delete Button */}
      <div className="flex items-center justify-between text-gray-500 text-sm mt-3">
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-1" />
          {address.email}
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600 transition"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

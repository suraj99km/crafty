import { MapPin, Phone } from "lucide-react";
import { Address } from "@/Types";
import { useRouter } from "next/navigation";

interface SelectAddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: (addr: Address) => void;
}

export default function SelectAddressCard({
  address,
  isSelected,
  onSelect,
}: SelectAddressCardProps) {
  const router = useRouter();

  // Handle address selection
  const handleAddressSelect = () => {
    // If logged in, proceed to select the address
    onSelect(address);
  };

  return (
    <div
      className={`relative rounded-lg p-3 text-sm transition cursor-pointer 
                  min-w-[250px] w-full max-w-md overflow-hidden
                  ring-2 ${isSelected ? "ring-green-500 shadow-lg scale-95" : "ring-gray-300 scale-95"}`}
      onClick={handleAddressSelect}
    >
      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-green-600 bg-opacity-20 rounded-lg z-[1]"></div>
      )}

      {/* Name & Phone */}
      <div className="flex justify-between items-center font-semibold relative z-[2]">
        <span>{address.first_name} {address.last_name}</span>
        
        {/* Phone Icon & Number */}
        <span className="flex items-center space-x-1 text-xs text-gray-600">
          <Phone className="h-3 w-3 text-gray-500" />
          <span>{address.phone}</span>
        </span>
      </div>

      {/* Address */}
      <p className="text-gray-600 mt-1 flex items-start leading-tight relative z-[2]">
        <MapPin className="h-3 w-3 mr-1 text-red-500 flex-shrink-0" />
        <span>
          {address.address_line1}
          {address.landmark && `, Near ${address.landmark}`}
          , {address.city}, {address.state} - {address.pincode}
        </span>
      </p>
    </div>
  );
}

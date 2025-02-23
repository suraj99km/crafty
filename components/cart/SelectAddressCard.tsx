import { MapPin, Phone } from "lucide-react";
import { Address } from "@/Types";

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
  return (
    <div
      className={`relative border rounded-lg p-3 text-sm transition cursor-pointer 
                  min-w-[250px] w-full max-w-md overflow-hidden
                  ${isSelected ? "border-green-500 shadow-lg" : "border-gray-300"}`}
      onClick={() => onSelect(address)}
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

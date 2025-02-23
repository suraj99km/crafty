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
      className={`relative border rounded-md p-2 text-sm transition cursor-pointer w-48 ${
        isSelected ? "border-green-500 shadow-md" : "border-gray-300"
      }`}
      onClick={() => onSelect(address)}
    >
      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-md"></div>
      )}

      {/* Name & Phone */}
      <div className="flex justify-between items-center font-semibold">
        <span>{address.first_name} {address.last_name}</span>
        <Phone className="h-3 w-3 text-gray-500" />
      </div>

      {/* Address */}
      <p className="text-gray-600 mt-1 flex items-start leading-tight">
        <MapPin className="h-3 w-3 mr-1 text-red-500 flex-shrink-0" />
        <span>
          {address.address_line1}, {address.city}, {address.state} - {address.pincode}
        </span>
      </p>
    </div>
  );
}

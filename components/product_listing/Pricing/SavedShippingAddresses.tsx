import { useEffect, useState, useRef } from "react";
import { fetchUserAddresses } from "@/lib/supabase-db/cartutils";
import supabase from "@/lib/supabase-db/supabaseClient";
import { useRouter } from "next/navigation";
import SelectAddressCard from "@/components/cart/SelectAddressCard";
import { Address } from "@/Types";
import Link from "next/link";
import { User, PlusCircle } from "lucide-react";

const SavedShippingAddresses = ({
  selectedAddress,
  setSelectedAddress,
}: {
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address) => void;
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserAddresses(userId).then(setAddresses);
    }
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollToRight = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth * 0.3, behavior: 'smooth' });
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth * 0.3, behavior: 'smooth' });
            }
          }, 800);
        }
      };
      scrollToRight();
      setTimeout(scrollToRight, 1600);
    }
  }, [addresses]);

  if (!userId) {
    return (
      <div className="mb-4 flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
        <p className="mb-2 text-gray-700">Please log in to view saved addresses.</p>
        <Link
          href="/login"
          className="flex items-center border-red-500 border gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-100"
        >
          <User size={20} className="text-gray-700" />
          <span className="font-semibold">Sign In / Login</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No saved addresses found.</p>
          <Link
            href="/addresses/add_new"
            className="mt-3 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-red-600"
          >
            <PlusCircle size={20} />
            <span>Add New Address</span>
          </Link>
        </div>
      ) : (
        <div ref={scrollRef} className="flex overflow-x-auto gap-3 max-h-60">
          {addresses.map((address) => (
            <SelectAddressCard
              key={address.id}
              address={address}
              isSelected={selectedAddress?.id === address.id}
              onSelect={setSelectedAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedShippingAddresses;

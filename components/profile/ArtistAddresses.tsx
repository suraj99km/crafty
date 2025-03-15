"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Trash, 
  Phone,Mail,
  AlertCircle, 
  CheckCircle,
  Plus,
  Home,
  Briefcase
} from "lucide-react";
import supabase from "@/lib/supabase-db/supabaseClient";
import { toast } from "sonner";

interface Address {
  id: number;
  user_id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export default function AddressesCard() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);

      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user?.id) {
        toast.error("User not authenticated.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_information")
        .select("*")
        .eq("user_id", user.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Failed to fetch addresses.");
      } else {
        setAddresses(data || []);
      }

      setLoading(false);
    };

    fetchAddresses();
  }, []);

  // Format address for display
  const formatAddress = (address: Address) => {
    return `${address.address_line1}, ${address.address_line2 ? address.address_line2 + ", " : ""}${address.city}, ${address.state} - ${address.pincode}`;
  };

  // Show delete confirmation
  const confirmDelete = (id: number) => {
    setDeleteConfirmId(id);
    
    toast.custom((t) => (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="font-medium text-gray-900">Delete address?</p>
        </div>
        <p className="text-gray-600 text-sm">
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <Button 
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            size="sm" 
            onClick={() => {
              setDeleteConfirmId(null);
              toast.dismiss(t);
            }}
          >
            Cancel
          </Button>
          <Button 
            className="bg-red-500 text-white hover:bg-red-600"
            size="sm"
            onClick={() => {
              handleDelete(id);
              toast.dismiss(t);
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    ), {
      duration: 10000,
    });
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from("user_information")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete address.");
    } else {
      toast.custom((t) => (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="font-medium text-gray-900">Address deleted successfully</span>
        </div>
      ), { duration: 3000 });
      
      setAddresses((prev) => prev.filter((address) => address.id !== id));
    }
    setDeleteConfirmId(null);
  };


  return (
    <Card className="shadow-md bg-white rounded-2xl border border-gray-200">
      <CardContent className="p-5 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
          <Button
            className="bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
            size="sm"
            onClick={() => router.push("/addresses/add_new")}
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="p-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition duration-200 group relative"
              >
                <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-5 w-5 text-red-500" />
                  <div className="flex items-center flex-wrap gap-2">
                  <p className="font-semibold text-gray-900">{address.first_name} {address.last_name}</p>
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  <p>{formatAddress(address)}</p>
                  <p className="mt-2 flex items-center gap-1">
                <Phone className="h-4 w-4 text-gray-600" />
                {address.phone}
                </p>
                <p className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-gray-600" />
                {address.email}
                </p>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  
                  <button
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 transition border border-gray-100 hover:border-red-100"
                    onClick={() => confirmDelete(address.id)}
                    aria-label="Delete address"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-gray-300 rounded-xl bg-white">
            <MapPin className="w-12 h-12 text-red-500 mb-3" />
            <p className="text-gray-500">No addresses saved yet</p>
            <Button 
              className="mt-4 bg-red-500 text-white hover:bg-red-600"
              onClick={() => router.push("/addresses/add_new")}
            >
              Add New Address
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
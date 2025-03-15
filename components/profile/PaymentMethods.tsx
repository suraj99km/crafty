import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Trash, 
  AlertCircle, 
  CheckCircle,
  Plus
} from "lucide-react";
import supabase from "@/lib/supabase-db/supabaseClient";
import { toast } from "sonner";

interface PaymentMethod {
  id: number;
  payment_method: string; // "Bank Account" or "UPI"
  details: Record<string, string>; // JSON data
}

export default function PaymentMethods() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [artistId, setArtistId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  const fieldLabels: Record<string, string> = {
    accountHolder: "Account Holder",
    bankAccount: "Bank Account",
    ifsc: "IFSC",
    upiId: "UPI ID",
  };

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setLoading(true);

      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user?.email) {
        toast.error("User not authenticated.");
        setLoading(false);
        return;
      }

      const { data: artist, error: artistError } = await supabase
        .from("Artists")
        .select("id")
        .eq("email_address", user.user.email)
        .single();

      if (artistError || !artist) {
        toast.error("Artist not found.");
        setLoading(false);
        return;
      }

      setArtistId(artist.id);

      const { data, error } = await supabase
        .from("artist_paymentmethods")
        .select("id, payment_method, details")
        .eq("artist_id", artist.id);

      if (error) {
        toast.error("Failed to fetch payment methods.");
      } else {
        setPaymentMethods(data);
      }

      setLoading(false);
    };

    fetchPaymentMethods();
  }, []);

  // Show delete confirmation
  const confirmDelete = (id: number) => {
    setDeleteConfirmId(id);
    
    // Show custom toast with actions
    toast.custom((t) => (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="font-medium text-gray-900">Delete payment method?</p>
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
      duration: 10000, // 10 seconds to decide
    });
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("artist_paymentmethods").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete payment method.");
    } else {
      toast.custom((t) => (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="font-medium text-gray-900">Payment method deleted successfully</span>
        </div>
      ), { duration: 3000 });
      
      setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
    }
    setDeleteConfirmId(null);
  };

  const getMethodIcon = (method: string) => {
    if (method === "Bank Account") {
      return <CreditCard className="h-5 w-5 text-red-500" />;
    } else if (method === "UPI") {
      return <CreditCard className="h-5 w-5 text-red-500" />;
    }
    return <CreditCard className="h-5 w-5 text-red-500" />;
  };

  return (
    <Card className="shadow-lg bg-white rounded-xl border-0">
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          
          <Button
            className="bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
            size="sm"
            onClick={() => router.push("/profile/payment-methods")}
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="p-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition duration-200 group relative"
              >
                <div className="flex items-center gap-3 mb-2">
                  {getMethodIcon(method.payment_method)}
                  <p className="text-md font-medium text-gray-800">{method.payment_method}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                  {Object.entries(method.details).map(([key, value]) => (
                    <p key={key} className="text-sm">
                      <span className="text-gray-500">{fieldLabels[key] || key}: </span>
                      <span className="font-medium text-gray-900">
                        {key === "bankAccount"
                          ? "•••• " + value.slice(-4) // Mask account numbers
                          : value.toUpperCase()}
                      </span>
                    </p>
                  ))}
                </div>

                {/* Delete Button */}
                <button
                  className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 transition border border-gray-100 hover:border-red-100"
                  onClick={() => confirmDelete(method.id)}
                  aria-label="Delete payment method"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-gray-300 rounded-xl bg-white">
            <CreditCard className="w-12 h-12 text-red-500 mb-3" />
            <p className="text-gray-500">No payment methods added yet</p>
            <Button 
              className="mt-4 bg-red-500 text-white hover:bg-red-600"
              onClick={() => router.push("/profile/payment-methods")}
            >
              Add Payment Method
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
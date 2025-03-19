import React, { useEffect, useState } from "react";
import supabase from "@/lib/supabase-db/supabaseClient"; // Adjust import as needed
import { toast } from "sonner"; // Import toast
import { getArtistId } from "@/lib/supabase-db/utils";

interface PaymentMethod {
  id: number;
  payment_method: string; // "Bank Account" or "UPI"
  details: Record<string, string>; // JSON data
}

interface PaymentMethodSelectionProps {
  onSelect: (methodId: number) => void; // Pass only the selected method's ID
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({ onSelect = () => {} }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setLoading(true);
      try {
        const artistId = await getArtistId();
        if (!artistId) {
          toast.error("Artist profile not found.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("artist_paymentmethods")
          .select("*")
          .eq("artist_id", artistId);

        if (error) throw error;

        setPaymentMethods(data || []);
      } catch (err) {
        console.log(err);
        toast.error("Error fetching the payment method.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (paymentMethods.length === 0) return (
    <div className="p-4 bg-gray-100 rounded-md text-center">
      <p className="text-gray-700 text-sm">
        You haven't added a payment method yet. Your earnings will be credited to your 
        <span className="font-semibold"> CraftID Wallet Balance</span>, accessible in 
        <span className="font-semibold"> Profile &gt; Business Details</span>.
      </p>
      <button
        onClick={() => window.location.href = "/profile/payment-methods"}
        className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 transition"
      >
        Add Payment Method
      </button>
    </div>
  );

  return (
    <div className="border-t pt-4">
      <h3 className="text-md font-semibold mb-4">Select Payment Method</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div 
            key={method.id}
            className="relative rounded-lg p-4 text-sm transition cursor-pointer min-w-[250px] w-full max-w-md overflow-hidden ring-2 ring-gray-300 hover:ring-green-500 hover:shadow-lg"
            onClick={() => {
              console.log("onSelect function type:", typeof onSelect);
              if (typeof onSelect === "function") {
                onSelect(method.id);
              } else {
                console.error("onSelect is not a function!");
              }
            }} // Pass only the ID
          >
            <div className="flex justify-between items-center font-semibold">
              <span>{method.payment_method}</span>
            </div>
            <p className="text-gray-600 mt-1">
              {method.payment_method === "BANK" ? (
                <>
                  <span className="block">Account Holder: {method.details.accountHolder}</span>
                  <span className="block">Account No: {method.details.bankAccount}</span>
                  <span className="block">IFSC: {method.details.ifsc}</span>
                </>
              ) : (
                <span>UPI ID: {method.details.upiId}</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
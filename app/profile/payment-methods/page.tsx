"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import supabase from "@/lib/supabase-db/supabaseClient";

export default function AddPaymentMethods() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"BANK" | "UPI" | "">("");
  const [artistId, setArtistId] = useState<string | null>(null);
  const [details, setDetails] = useState({
    accountHolder: "",
    bankAccount: "",
    ifsc: "",
    upiId: "",
  });

  useEffect(() => {
    const fetchArtistId = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.email) return;

      const { data: artist, error: artistError } = await supabase
        .from("Artists")
        .select("id")
        .eq("email_address", user.email)
        .single();

      if (artistError || !artist) {
        toast.error("Artist profile not found.");
      } else {
        setArtistId(artist.id);
      }
    };

    fetchArtistId();
  }, []);

  const handleSave = async () => {
    if (!artistId) {
      toast.error("Artist not found. Please try again.");
      return;
    }

    if (
      (paymentMethod === "BANK" &&
        (!details.accountHolder || !details.bankAccount || !details.ifsc)) ||
      (paymentMethod === "UPI" && !details.upiId)
    ) {
      toast.error("Please fill in all required details.");
      return;
    }

    const paymentData = {
      payment_method: paymentMethod,
      artist_id: artistId,
      details:
        paymentMethod === "BANK"
          ? {
              accountHolder: details.accountHolder.toUpperCase(),
              bankAccount: details.bankAccount,
              ifsc: details.ifsc.toUpperCase(),
            }
          : { upiId: details.upiId },
    };

    const { error } = await supabase.from("artist_paymentmethods").insert([paymentData]);

    if (error) {
      console.log(error);
      toast.error("Error saving payment method.");
    } else {
      toast.success("Payment method saved successfully!");
      setTimeout(() => router.back(), 1000);
    }
  };

  return (
    <div className="mt-16 max-w-lg mx-auto min-h-screen p-6 flex flex-col">
      {/* Title & Back Button */}
      <div className="relative flex items-center justify-center mb-6">
        <button
          onClick={() => router.back()}
          className="absolute left-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all duration-200"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Add Payment Method</h2>
      </div>

      {/* Payment Method Selection */}
      <Card className="shadow-md bg-white rounded-2xl border border-gray-200">
        <CardContent className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Select Payment Method</h3>
          <RadioGroup
            className="space-y-3"
            onValueChange={(value) => setPaymentMethod(value as "BANK" | "UPI")}
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="BANK" id="BANK" />
              <label htmlFor="BANK" className="text-gray-800 cursor-pointer font-medium">
                Bank Transfer (NEFT / IMPS)
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="UPI" id="UPI" />
              <label htmlFor="UPI" className="text-gray-800 cursor-pointer font-medium">
                UPI Payment
              </label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Conditional Form Based on Selection */}
      {paymentMethod && (
        <Card className="shadow-md bg-white rounded-2xl border border-gray-200 mt-6">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              {paymentMethod === "BANK" ? "Bank Transfer Details" : "UPI Payment Details"}
            </h3>

            {paymentMethod === "BANK" && (
              <>
                <Input
                  type="text"
                  placeholder="Account Holder Name"
                  value={details.accountHolder}
                  className="border rounded-lg p-3 text-sm"
                  onChange={(e) =>
                    setDetails({ ...details, accountHolder: e.target.value.toUpperCase() })
                  }
                />
                <Input
                  type="text"
                  placeholder="Bank Account Number"
                  value={details.bankAccount}
                  className="border rounded-lg p-3 text-sm"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setDetails({ ...details, bankAccount: value });
                    }
                  }}
                />
                <Input
                  type="text"
                  placeholder="IFSC Code"
                  value={details.ifsc}
                  className="border rounded-lg p-3 text-sm"
                  maxLength={11}
                  onChange={(e) => {
                    let value = e.target.value.toUpperCase();
                    if (/^[A-Z]{0,4}[A-Z0-9]{0,7}$/.test(value)) {
                      setDetails({ ...details, ifsc: value });
                    }
                  }}
                />
              </>
            )}

            {paymentMethod === "UPI" && (
              <Input
                type="text"
                placeholder="Enter your UPI ID (e.g., name@upi)"
                value={details.upiId}
                className="border rounded-lg p-3 text-sm"
                onChange={(e) => setDetails({ ...details, upiId: e.target.value })}
              />
            )}

            {/* Save Button */}
            <Button className="w-full bg-red-500 text-white hover:bg-red-600 mt-4" onClick={handleSave}>
              Save Payment Method
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
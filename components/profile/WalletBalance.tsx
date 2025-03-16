import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-db/supabaseClient"; // Adjust based on your setup
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { toast } from "sonner";

const WalletBalance = () => {
  const [artistId, setArtistId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isNewArtist, setIsNewArtist] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArtistWallet = async () => {
      setLoading(true);
  
      // Get authenticated user
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user?.email) {
        toast.error("User not authenticated.");
        setLoading(false);
        return;
      }
  
      // Fetch artist ID using email
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
  
      // Fetch wallet balance using new RLS policy
      const { data: wallet, error: walletError } = await supabase
        .from("artist_wallet")
        .select("balance")
        .eq("artist_id", artist.id) // Now allowed by policy
        .single();
  
      if (walletError) {
        toast.error("Failed to fetch wallet balance.");
      } else {
        setBalance(wallet?.balance || 0);
      }
  
      setLoading(false);
    };
  
    fetchArtistWallet();
  }, []);

  return (
    <Card className="shadow-md bg-white rounded-2xl border border-gray-200">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Wallet Balance</h3>
          <Wallet className="w-5 h-5 text-gray-600" />
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Available Balance</p>
          {loading ? (
            <p className="text-sm text-gray-400 mt-4">Fetching...</p>
          ) : isNewArtist ? (
            <p className="text-sm text-gray-400">No wallet activity yet</p>
          ) : (
            <p className="text-2xl font-bold text-green-600">
              INR {balance !== null ? balance.toFixed(2) : "0.00"}
            </p>
          )}
        </div>
        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm" className="text-xs" disabled={loading || isNewArtist}>
            Withdraw
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            disabled={loading}
            onClick={() => (window.location.href = "/profile/wallet-transactions")}
          >
            View Transactions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
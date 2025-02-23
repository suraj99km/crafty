import supabase from "@/lib/supabase-db/supabaseClient";
import { Address } from "@/Types";

/**
 * Fetches saved addresses for a specific user.
 * @param userId - The ID of the logged-in user.
 * @returns List of addresses.
 */
export const fetchUserAddresses = async (userId: string): Promise<Address[]> => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("user_information")
    .select("id, first_name, last_name, phone, email, address_line1, address_line2, landmark, city, state, pincode")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }

  return data || [];
};

// Get Logged-in User ID
export const getUserID = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
  return data?.user?.id || null;
};

// Place Order Function
export const placeOrder = async (orderData: {
  user_id: string;
  address_id: number;
  total_price: number;
  payment_method: string;
  payment_partner: string;
  products: { product_id: number; quantity: number; artist_id: number }[];
}) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: orderData.user_id,
          address_id: orderData.address_id,
          total_price: orderData.total_price,
          payment_method: orderData.payment_method,
          payment_partner: orderData.payment_partner,
          products: orderData.products, // This should be stored as an array in Supabase
        },
      ])
      .select();

    if (error) throw error;

    console.log("Order placed successfully:", data);
    return data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};


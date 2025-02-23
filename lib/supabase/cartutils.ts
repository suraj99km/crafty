import supabase from "@/lib/supabase/supabaseClient";
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

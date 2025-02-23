"use client";

import { useState, useEffect } from "react";
import { Address } from "@/Types";
import { useRouter } from "next/navigation"; // Import router
import { ChevronLeft } from "lucide-react";

const CheckoutPage = () => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [cartData, setCartData] = useState<{ id: number; title: string; quantity: number }[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Retrieve selected address
    const storedAddress = localStorage.getItem("selectedAddress");
    if (storedAddress) {
      setSelectedAddress(JSON.parse(storedAddress));
    }

    // Retrieve cart data
    const storedCartData = localStorage.getItem("cartData");
    if (storedCartData) {
      const parsedCart = JSON.parse(storedCartData);
      setCartData(parsedCart);

      // 🚀 **Redirect if the cart is empty**
      if (parsedCart.length === 0) {
        router.replace("/cart"); // Redirect to cart page
      }
    } else {
      router.replace("/cart"); // Redirect if cart data is missing
    }

    // Retrieve total
    const storedTotal = localStorage.getItem("total");
    if (storedTotal) {
      setTotal(JSON.parse(storedTotal));
    }
  }, [router]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress || cartData.length === 0) {
      alert("Missing address or cart items.");
      return;
    }

    const orderData = {
      address_id: selectedAddress.id,
      user_id: "currentUserId", // Replace with actual user ID
      product_ids: cartData.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
      })),
      total_price: total,
      payment_method: "UPI",
      payment_partner: "Razorpay",
    };

    console.log("Placing Order:", orderData);
    // Call Supabase function to store order
  };

  return (
    <div className="mt-16 min-h-screen p-4 bg-gray-100 h-screen">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-2">
        <button
            onClick={router.back}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
        >
            <ChevronLeft size={20} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 absolute left-1/2 transform -translate-x-1/2">
            Checkout
        </h1>
        </div>

        {/* Display Selected Address */}
        {selectedAddress ? (
        <div className="bg-white p-3 rounded-lg shadow-sm border mb-4 flex flex-col">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Shipping Address</h2>
            <p className="text-sm text-gray-700">
            {selectedAddress.first_name} {selectedAddress.last_name}
            </p>
            <p className="text-sm text-gray-500">
            {selectedAddress.address_line1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
            </p>
            <p className="text-sm text-gray-500">Phone: {selectedAddress.phone}</p>
        </div>
        ) : (
        <p className="text-gray-500 text-sm">No address selected.</p>
        )}

        {/* Product List */}
        <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">Order Summary</h2>
        {cartData.length > 0 ? (
            <ul className="space-y-1">
            {cartData.map((item) => (
                <li key={item.id} className="flex justify-between text-sm text-gray-700">
                <span>
                    {item.title} × {item.quantity}
                </span>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-gray-500 text-sm">No items in cart.</p>
        )}
        </div>


      {/* Fixed Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg flex justify-between items-center border-t">
        <span className="text-lg font-semibold">Total: ₹ {total.toFixed(2)}</span>
        <button
          onClick={handlePlaceOrder}
          className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;

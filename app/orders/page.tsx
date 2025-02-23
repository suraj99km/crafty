"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No past orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-white rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition"
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              <p className="text-lg font-semibold text-gray-800">
                Order #{order.id}
              </p>
              <p className="text-sm text-gray-600">
                Placed on: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-900 font-bold mt-2">
                Total: ₹{order.total_price}
              </p>
              <p className={`text-sm mt-1 ${
                order.status === "Delivered"
                  ? "text-green-600"
                  : order.status === "Shipped"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}>
                Status: {order.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

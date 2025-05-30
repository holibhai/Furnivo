import React from "react";
import { useNavigate } from "react-router-dom";

const OrderCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-700">
      <h1 className="text-3xl font-bold mb-4">❌ Payment Canceled</h1>
      <p className="text-lg">Your payment was not completed.</p>
      <button
        onClick={() => navigate("/user/userOrderDisplay")}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Back to Orders
      </button>
    </div>
  );
};

export default OrderCanceled;

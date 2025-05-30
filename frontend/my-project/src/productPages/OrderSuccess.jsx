import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle } from "react-feather";
import axios from "axios";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteCartItems = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        throw new Error("User authentication details missing");
      }

      const response = await axios.delete(
        `http://localhost:8080/api/cartItem/delete/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Cart items successfully deleted");
      }
    } catch (error) {
      console.error("Failed to delete cart items:", error);
      setError("Failed to clear your cart. Please contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("session_id");
    if (id) {
      setSessionId(id);
      // Verify payment with backend here if needed
    }

    deleteCartItems();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 mt-20">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Payment Successful
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>
        
        {isLoading && (
          <p className="text-sm text-gray-500 mb-4">Clearing your cart...</p>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        {sessionId && (
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="text-xs text-gray-500 mb-1">Transaction Reference</p>
            <p className="text-sm font-mono text-gray-800 break-all">
              {sessionId}
            </p>
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <Link
            to="/user/userOrderDisplay"
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition duration-150"
          >
            View Your Orders
          </Link>
          
          <Link
            to="/"
            className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition duration-150"
          >
            Continue Shopping
          </Link>
        </div>
        
        <p className="text-xs text-gray-400 mt-6">
          A confirmation email has been sent to your registered address.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
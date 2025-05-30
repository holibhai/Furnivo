import React, { useEffect, useState } from "react";
import axios from "axios";

const Delivery = ({
  receiverFirstName,
  receiverLastName,
  city,
  receiverMobileNumber,
  streetAddress1,
  streetAddress2,
  deliveryOrderNotes,
  handleDeliveryChange,
}) => {
  const [deliveryCostData, setDeliveryCostData] = useState([]);
  const [shippingCost, setShippingCost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/deliveryCharge/get`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDeliveryCostData(response.data.deliveryChargeDtoList);
      } catch (error) {
        console.error("Failed to fetch delivery charges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryCharge();
  }, []);

  const handleCheckShippingCost = async () => {
    if (!city) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/deliveryCharge/getPrice/${city}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setShippingCost(response.data.deliveryChargeDto.price);
    } catch (error) {
      console.error("Failed to fetch shipping cost:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white  rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Shipping Details</h1>

      <div className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="receiverFirstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="receiverFirstName"
              value={receiverFirstName}
              onChange={handleDeliveryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="receiverLastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="receiverLastName"
              value={receiverLastName}
              onChange={handleDeliveryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* City and Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <select
              name="city"
              value={city}
              onChange={handleDeliveryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              disabled={isLoading}
            >
              <option value="">Select a City</option>
              {deliveryCostData.map((item) => (
                <option key={item.id} value={item.city}>
                  {item.city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="receiverMobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Phone
            </label>
            <input
              type="tel"
              name="receiverMobileNumber"
              value={receiverMobileNumber}
              onChange={handleDeliveryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* Address Fields */}
        <div>
          <label htmlFor="streetAddress1" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <input
            type="text"
            name="streetAddress1"
            placeholder="House number and street name"
            value={streetAddress1}
            onChange={handleDeliveryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="streetAddress2" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address 2 (optional)
          </label>
          <input
            type="text"
            name="streetAddress2"
            placeholder="Apartment, suite, unit, etc..."
            value={streetAddress2}
            onChange={handleDeliveryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Order Notes */}
        <div>
          <label htmlFor="deliveryOrderNotes" className="block text-sm font-medium text-gray-700 mb-1">
            Order Notes (Optional)
          </label>
          <textarea
            name="deliveryOrderNotes"
            value={deliveryOrderNotes}
            onChange={handleDeliveryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px]"
            placeholder="Notes about your order..."
          />
        </div>

        {/* Shipping Cost Section */}
        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Cost
          </label>
          <button
            type="button"
            onClick={handleCheckShippingCost}
            disabled={!city || isLoading}
            className={`w-full py-3 px-4 rounded-md font-medium text-white transition ${
              !city || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Calculating...' : 'Check Shipping Cost'}
          </button>
          
          <div className="flex justify-between items-center py-3 mt-4 border-t border-gray-200">
            <span className="font-medium text-gray-700">Shipping Cost</span>
            <span className="font-semibold text-gray-800">
              {shippingCost !== null ? `Rs. ${shippingCost}` : "Not calculated"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PackageSearch, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const UserOrdersDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const allStatuses = ["All", "PENDING", "PROCESSING", "DELIVERED", "CANCELLED"];
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/order/getAllOrders/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = response.data.orderDtoList || [];
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching user orders", error);
      }
    };

    fetchUserOrders();
  }, [userId]);

  useEffect(() => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  return (
    <div className="px-4 py-6">
      <div className="rounded-2xl p-6 border border-gray-300 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-6">
            <p className="text-2xl font-bold text-gray-800">
              Order History <PackageSearch className="inline ml-2" />
            </p>
            <p className="text-sm mt-1 text-gray-500">
              {filteredOrders.length} Orders Found
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 text-xs border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 text-xs bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {allStatuses.map((status, idx) => (
              <option key={idx} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <table className="w-full text-left border text-sm border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Order ID</th>
              <th className="p-4">Total</th>
              <th className="p-4">Delivery Type</th>
              <th className="p-4">Items</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={order.orderId} className="border hover:bg-gray-50 text-sm">
                  <td className="p-4 text-xs">{index + 1}</td>
                  <td className="p-4 text-xs">#{order.orderId}</td>
                  <td className="p-4 text-xs">Rs. {order.netTotal}</td>
                  <td className="p-4 text-xs">
                    {order.billing?.delivery?.deliveryType || "-"}
                  </td>
                  <td className="p-4 text-xs">{order.orderItems.length} items</td>
                  <td className="p-4 text-xs">{order.orderDate}</td>
                  <td className="p-4 text-xs">
                    <span
                      className={`px-4 py-2 rounded-full text-[10px] font-semibold
                      ${
                        order.orderStatus === "PENDING"
                          ? "bg-yellow-200 text-yellow-700"
                          : order.orderStatus === "PROCESSING"
                          ? "bg-blue-100 text-blue-700"
                          : order.orderStatus === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-xs">
                    <Link
                      to={`/user/orderTrack/${order.orderId}`}
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOrdersDisplay;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, PackageSearch, Eye } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const DisplayOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [allStatuses, setAllStatuses] = useState([
    "ALL",
    "PENDING",
    "PROCESSING",
    "DELIVERED",
    "CANCELLED",
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/order/get", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data.orderDtoList;
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (order) => order.orderStatus === statusFilter
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8080/api/order/delete/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const updatedOrders = orders.filter((order) => order.orderId !== orderId);
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete order");
    }
  };

  return (
    <div className="">
      <div className="rounded-2xl p-6 border border-gray-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-6">
            <p className="text-3xl font-bold text-gray-800">
              Orders <PackageSearch className="inline" />
            </p>
            <p className="text-xs font-normal mt-4">
              {filteredOrders.length} Orders Available
            </p>
          </div>
        </div>

        <div className="flex justify-evenly items-center gap-32 my-10">
          <div className="border-l-8 border-yellow-500 w-[80px] h-[60px] px-2 rounded-lg">
            <span className="text-3xl font-bold">
              {orders.filter((o) => o.orderStatus === "PENDING").length}
            </span>{" "}
            <span className="text-sm">Pending</span>
          </div>
          <div className="border-l-8 border-blue-500 w-[80px] h-[60px] px-2 rounded-lg">
            <span className="text-3xl font-bold">
              {orders.filter((o) => o.orderStatus === "PROCESSING").length}
            </span>{" "}
            <span className="text-sm">Processing</span>
          </div>
          <div className="border-l-8 border-green-500 w-[80px] h-[60px] px-2 rounded-lg">
            <span className="text-3xl font-bold">
              {orders.filter((o) => o.orderStatus === "DELIVERED").length}
            </span>{" "}
            <span className="text-sm">Delivered</span>
          </div>
          <div className="border-l-8 border-red-500 w-[80px] h-[60px] px-2 rounded-lg">
            <span className="text-3xl font-bold">
              {orders.filter((o) => o.orderStatus === "CANCELLED").length}
            </span>{" "}
            <span className="text-sm">Cancelled</span>
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
              <th className="p-4">Total Amount</th>
              <th className="p-4">Delivery Type</th>
              <th className="p-4">Total Products</th>
              <th className="p-4">Ordered Date</th>
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
                  <td className="p-4 text-xs">Rs.{order.netTotal}</td>
                  <td className="p-4 text-xs">
                    {order.billing?.delivery?.deliveryType}
                  </td>
                  <td className="p-4 text-xs">{order.orderItems.length} products</td>
                  <td className="p-4 text-xs">{order.orderDate}</td>
                  <td className="p-4 text-xs">
                    <span
                      className={`px-4 py-2 rounded-full text-[10px] font-semibold ${
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
                  <td className="p-4 flex gap-2 text-xs items-center">
                    <Link
                      to={`/admin/viewOrder/${order.id}`}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-[15px]" /> View
                    </Link>
                    <button
                      onClick={() => handleDelete(order.orderId)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-[15px]" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-gray-500" colSpan={8}>
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

export default DisplayOrders;

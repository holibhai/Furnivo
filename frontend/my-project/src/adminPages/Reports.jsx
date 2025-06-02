import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Calendar, 
  Filter, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Package,
  Download,
  RefreshCw
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [statusFilter, setStatusFilter] = useState("DELIVERED");

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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Apply date filter
    if (startDate && endDate) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, startDate, endDate, statusFilter]);

  // Prepare data for charts
  const getRevenueByMonth = () => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const revenueByMonth = months.map(month => ({ month, revenue: 0 }));

    filteredOrders.forEach(order => {
      const date = new Date(order.orderDate);
      const month = date.getMonth();
      if (!isNaN(order.netTotal)) {
        revenueByMonth[month].revenue += parseFloat(order.netTotal);
      }
    });

    return revenueByMonth;
  };

  const getRevenueByStatus = () => {
    const statuses = ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"];
    return statuses.map(status => {
      const ordersForStatus = filteredOrders.filter(o => o.orderStatus === status);
      const revenue = ordersForStatus.reduce((sum, order) => sum + parseFloat(order.netTotal || 0), 0);
      return { name: status, value: revenue };
    });
  };

  const getTopProducts = () => {
    const productMap = {};

    filteredOrders.forEach(order => {
      order.orderItems.forEach(item => {
        if (productMap[item.productId]) {
          productMap[item.productId].revenue += item.price * item.quantity;
          productMap[item.productId].quantity += item.quantity;
        } else {
          productMap[item.productId] = {
            name: item.productName,
            revenue: item.price * item.quantity,
            quantity: item.quantity
          };
        }
      });
    });

    return Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const getDailyRevenue = () => {
    const dailyRevenue = {};

    filteredOrders.forEach(order => {
      const date = new Date(order.orderDate).toLocaleDateString();
      if (dailyRevenue[date]) {
        dailyRevenue[date] += parseFloat(order.netTotal || 0);
      } else {
        dailyRevenue[date] = parseFloat(order.netTotal || 0);
      }
    });

    return Object.entries(dailyRevenue).map(([date, revenue]) => ({
      date,
      revenue
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Summary statistics
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.netTotal || 0), 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
  const deliveredOrders = filteredOrders.filter(o => o.orderStatus === "DELIVERED").length;

  const exportToCSV = () => {
    const headers = ["Order ID", "Date", "Status", "Amount", "Products", "Delivery Type"];
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map(order => [
        order.orderId,
        order.orderDate,
        order.orderStatus,
        order.netTotal,
        order.orderItems.length,
        order.billing?.delivery?.deliveryType || "N/A"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `revenue_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Revenue Reports</h1>
        <div className="flex space-x-4">
          <button 
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable={true}
              placeholderText="Select date range"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setDateRange([null, null])}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-xl font-semibold">Rs. {totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-xl font-semibold">{totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
              <p className="text-xl font-semibold">Rs. {avgOrderValue}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Package className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Delivered Orders</p>
              <p className="text-xl font-semibold">{deliveredOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-gray-700 mb-4">Monthly Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getRevenueByMonth()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`Rs. ${value}`, "Revenue"]} />
                <Legend />
                <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Status */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-gray-700 mb-4">Revenue by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getRevenueByStatus()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {getRevenueByStatus().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`Rs. ${value}`, "Revenue"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Revenue Trend */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-gray-700 mb-4">Daily Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getDailyRevenue()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`Rs. ${value}`, "Revenue"]} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products by Revenue */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-gray-700 mb-4">Top Products by Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={getTopProducts()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => [`Rs. ${value}`, "Revenue"]} />
                <Legend />
                <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium text-gray-700 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.slice(0, 5).map((order) => (
                <tr key={order.orderId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.orderStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      order.orderStatus === "PROCESSING" ? "bg-blue-100 text-blue-800" :
                      order.orderStatus === "DELIVERED" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rs. {order.netTotal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderItems.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
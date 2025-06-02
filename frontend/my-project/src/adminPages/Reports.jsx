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
  RefreshCw,
  Users,
  UserPlus
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A4DE6C', '#D0ED57'];

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [statusFilter, setStatusFilter] = useState("DELIVERED");
  const [activeTab, setActiveTab] = useState("revenue");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch orders
        const ordersResponse = await axios.get("http://localhost:8080/api/order/get", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Fetch users
        const usersResponse = await axios.get("http://localhost:8080/api/user/getUsers", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const ordersData = ordersResponse.data.orderDtoList;
        const usersData = usersResponse.data.userAccountDtoList;

        setOrders(ordersData);
        setFilteredOrders(ordersData);
        setUsers(usersData);
        setFilteredUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredOrdersData = orders;
    let filteredUsersData = users;

    // Apply date filter
    if (startDate && endDate) {
      filteredOrdersData = filteredOrdersData.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startDate && orderDate <= endDate;
      });

      filteredUsersData = filteredUsersData.filter(user => {
        const userDate = new Date(user.date);
        return userDate >= startDate && userDate <= endDate;
      });
    }

    // Apply status filter (only for orders)
    if (statusFilter !== "ALL" && activeTab === "revenue") {
      filteredOrdersData = filteredOrdersData.filter(order => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filteredOrdersData);
    setFilteredUsers(filteredUsersData);
  }, [orders, users, startDate, endDate, statusFilter, activeTab]);

  // Prepare data for revenue charts
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

  // Prepare data for customer charts
  const getCustomerSignupsByMonth = () => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const signupsByMonth = months.map(month => ({ month, signups: 0 }));

    filteredUsers.forEach(user => {
      const date = new Date(user.date);
      const month = date.getMonth();
      signupsByMonth[month].signups += 1;
    });

    return signupsByMonth;
  };

  const getDailyCustomerSignups = () => {
    const dailySignups = {};

    filteredUsers.forEach(user => {
      const date = new Date(user.date).toLocaleDateString();
      if (dailySignups[date]) {
        dailySignups[date] += 1;
      } else {
        dailySignups[date] = 1;
      }
    });

    return Object.entries(dailySignups).map(([date, signups]) => ({
      date,
      signups
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getCustomerSignupsByWeek = () => {
    const weeklySignups = {};
    
    filteredUsers.forEach(user => {
      const date = new Date(user.date);
      const weekNumber = getWeekNumber(date);
      const weekKey = `Week ${weekNumber}`;
      
      if (weeklySignups[weekKey]) {
        weeklySignups[weekKey] += 1;
      } else {
        weeklySignups[weekKey] = 1;
      }
    });

    return Object.entries(weeklySignups).map(([week, signups]) => ({
      week,
      signups
    })).sort((a, b) => parseInt(a.week.split(' ')[1]) - parseInt(b.week.split(' ')[1]));
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Summary statistics
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.netTotal || 0), 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
  const deliveredOrders = filteredOrders.filter(o => o.orderStatus === "DELIVERED").length;
  const totalCustomers = filteredUsers.length;
  const newCustomersThisMonth = filteredUsers.filter(user => {
    const userDate = new Date(user.date);
    const currentDate = new Date();
    return userDate.getMonth() === currentDate.getMonth() && 
           userDate.getFullYear() === currentDate.getFullYear();
  }).length;

  const exportToCSV = () => {
    let headers, csvContent;

    if (activeTab === "revenue") {
      headers = ["Order ID", "Date", "Status", "Amount", "Products", "Delivery Type"];
      csvContent = [
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
    } else {
      headers = ["User ID", "Username", "First Name", "Last Name", "Role", "Signup Date"];
      csvContent = [
        headers.join(","),
        ...filteredUsers.map(user => [
          user.id,
          user.username,
          user.firstName,
          user.lastName,
          user.role,
          user.date
        ].join(","))
      ].join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeTab}_report_${new Date().toISOString().slice(0, 10)}.csv`);
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
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        <div className="flex space-x-4">
          <button 
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === "revenue" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("revenue")}
        >
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" /> Revenue Analytics
          </div>
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === "customers" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("customers")}
        >
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" /> Customer Analytics
          </div>
        </button>
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
          {activeTab === "revenue" && (
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
          )}
          <div className="flex items-end">
            <button
              onClick={() => {
                setDateRange([null, null]);
                if (activeTab === "revenue") setStatusFilter("DELIVERED");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {activeTab === "revenue" ? (
          <>
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
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Customers</p>
                  <p className="text-xl font-semibold">{totalCustomers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">New This Month</p>
                  <p className="text-xl font-semibold">{newCustomersThisMonth}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg. Daily Signups</p>
                  <p className="text-xl font-semibold">
                    {filteredUsers.length > 0 ? 
                      (filteredUsers.length / (Math.ceil((endDate || new Date() - (startDate || new Date(filteredUsers[0].date))) / (1000 * 60 * 60 * 24))).toFixed(1)) : 
                      0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <Package className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-xl font-semibold">
                    {users.filter(user => {
                      const userDate = new Date(user.date);
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                      return userDate >= thirtyDaysAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {activeTab === "revenue" ? (
        <>
          {/* Revenue Charts */}
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
        </>
      ) : (
        <>
          {/* Customer Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Customer Signups */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium text-gray-700 mb-4">Monthly Customer Signups</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCustomerSignupsByMonth()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}`, "Signups"]} />
                    <Legend />
                    <Bar dataKey="signups" fill="#3B82F6" name="Signups" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Customer Signups */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium text-gray-700 mb-4">Weekly Customer Signups</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCustomerSignupsByWeek()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}`, "Signups"]} />
                    <Legend />
                    <Bar dataKey="signups" fill="#10B981" name="Signups" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Daily Signup Trend */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium text-gray-700 mb-4">Daily Signup Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getDailyCustomerSignups()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}`, "Signups"]} />
                    <Legend />
                    <Line type="monotone" dataKey="signups" stroke="#3B82F6" name="Signups" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Customer Role Distribution */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium text-gray-700 mb-4">Customer Role Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Users', value: filteredUsers.filter(u => u.role === 'USER').length },
                        { name: 'Admins', value: filteredUsers.filter(u => u.role === 'ADMIN').length }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Customers Table */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-700 mb-4">Recent Customers</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signup Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.slice(0, 5).map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.firstName} {user.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "ADMIN" ? "bg-purple-100 text-purple-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Users,
  Star,
  Package,
  Eye,
  Plus,
  Search,
  Pencil,
  Trash2,
  DollarSign,
  Percent,
  List,
  AlertCircle,
  Box,
  ShoppingBag,
  MessageSquare,
  BarChart2,
  Calendar
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
} from "recharts";

const AdminHome = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    reviews: 0,
    customers: 0
  });
  const [orderData, setOrderData] = useState([]);
  const [timeRange, setTimeRange] = useState("monthly");
  const navigate = useNavigate();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Fetch all dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products
        const productsRes = await axios.get(
          "http://localhost:8080/api/product/getAll",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        // Fetch orders
        const ordersRes = await axios.get(
          "http://localhost:8080/api/order/get",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        // Fetch reviews
        const reviewsRes = await axios.get(
          "http://localhost:8080/api/review/getAll",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        // Fetch users
        const usersRes = await axios.get(
          "http://localhost:8080/api/user/getUsers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setProducts(productsRes.data.productDtoList || []);
        setFilteredProducts(productsRes.data.productDtoList || []);
        
        setStats({
          products: productsRes.data.productDtoList?.length || 0,
          orders: ordersRes.data.orderDtoList?.length || 0,
          reviews: reviewsRes.data?.length || 0,
          customers: usersRes.data.userAccountDtoList?.length || 0
        });

        // Process order data for charts
        if (ordersRes.data.orderDtoList) {
          processOrderData(ordersRes.data.orderDtoList);
        }

      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process order data for charts
  const processOrderData = (orders) => {
    // Process data for different time ranges
    const now = new Date();
    const monthlyData = processOrdersByTimeRange(orders, 'month', now);
    const weeklyData = processOrdersByTimeRange(orders, 'week', now);
    const dailyData = processOrdersByTimeRange(orders, 'day', now);
    
    // Process data for product categories
    const categoryData = processOrdersByCategory(orders);
    
    // Process data for order status
    const statusData = processOrdersByStatus(orders);
    
    // Process revenue data
    const revenueData = processRevenueData(orders);
    
    setOrderData({
      monthly: monthlyData,
      weekly: weeklyData,
      daily: dailyData,
      categories: categoryData,
      status: statusData,
      revenue: revenueData
    });
  };

  // Process orders by time range
  const processOrdersByTimeRange = (orders, range, endDate) => {
    const dataMap = new Map();
    const result = [];
    const rangeCount = range === 'month' ? 12 : range === 'week' ? 4 : 7;
    
    // Initialize data structure
    for (let i = rangeCount - 1; i >= 0; i--) {
      const date = new Date(endDate);
      if (range === 'month') {
        date.setMonth(date.getMonth() - i);
        const key = date.toLocaleString('default', { month: 'short' });
        dataMap.set(key, { name: key, orders: 0, revenue: 0 });
      } else if (range === 'week') {
        date.setDate(date.getDate() - (i * 7));
        const key = `Week ${Math.ceil((date.getDate()) / 7)}`;
        dataMap.set(key, { name: key, orders: 0, revenue: 0 });
      } else {
        date.setDate(date.getDate() - i);
        const key = date.toLocaleString('default', { weekday: 'short' });
        dataMap.set(key, { name: key, orders: 0, revenue: 0 });
      }
    }
    
    // Process orders
    orders.forEach(order => {
      const orderDate = new Date(order.orderDate);
      let key;
      
      if (range === 'month') {
        key = orderDate.toLocaleString('default', { month: 'short' });
      } else if (range === 'week') {
        key = `Week ${Math.ceil((orderDate.getDate()) / 7)}`;
      } else {
        key = orderDate.toLocaleString('default', { weekday: 'short' });
      }
      
      if (dataMap.has(key)) {
        const entry = dataMap.get(key);
        entry.orders += 1;
        entry.revenue += order.totalAmount;
      }
    });
    
    // Convert to array
    dataMap.forEach(value => {
      result.push(value);
    });
    
    return result;
  };

  // Process orders by category
  const processOrdersByCategory = (orders) => {
    const categoryMap = new Map();
    
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const category = item.productCategory || 'Unknown';
        if (categoryMap.has(category)) {
          const entry = categoryMap.get(category);
          entry.value += 1;
          entry.revenue += item.price * item.quantity;
        } else {
          categoryMap.set(category, { 
            name: category, 
            value: 1,
            revenue: item.price * item.quantity
          });
        }
      });
    });
    
    return Array.from(categoryMap.values());
  };

  // Process orders by status
  const processOrdersByStatus = (orders) => {
    const statusMap = new Map();
    
    orders.forEach(order => {
      const status = order.orderStatus || 'Unknown';
      if (statusMap.has(status)) {
        const entry = statusMap.get(status);
        entry.value += 1;
      } else {
        statusMap.set(status, { 
          name: status, 
          value: 1
        });
      }
    });
    
    return Array.from(statusMap.values());
  };

  // Process revenue data
  const processRevenueData = (orders) => {
    const revenueData = [];
    const now = new Date();
    
    // Last 6 months revenue
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      });
      
      const revenue = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      revenueData.push({
        name: monthName,
        revenue: revenue
      });
    }
    
    return revenueData;
  };

  const handleViewClick = (category) => {
    setSelectedCategory(category);
    setFilteredProducts(
      products.filter(p => p.category.toLowerCase() === category.toLowerCase())
    );
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchText(searchValue);
    
    if (selectedCategory) {
      setFilteredProducts(
        products.filter(p => 
          p.category.toLowerCase() === selectedCategory.toLowerCase() &&
          p.productName.toLowerCase().includes(searchValue)
      ));
    } else {
      setFilteredProducts(
        products.filter(p => p.productName.toLowerCase().includes(searchValue)))
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      setIsLoading(true);
      await axios.delete(
        `http://localhost:8080/api/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts.filter(p => 
        selectedCategory 
          ? p.category.toLowerCase() === selectedCategory.toLowerCase()
          : true
      ));
      setStats(prev => ({ ...prev, products: prev.products - 1 }));
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = (productId) => {
    navigate("/admin/productUpdate", { state: { productId } });
  };

  const handleViewProduct = (productId) => {
    navigate("/admin/displayProduct", { state: { productId } });
  };

  // Dashboard cards data
  const dashboardCards = [
    {
      title: "Total Products",
      value: stats.products,
      icon: <Package size={24} />,
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
      onClick: () => handleViewClick("")
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: <ShoppingBag size={24} />,
      gradient: "bg-gradient-to-r from-green-500 to-green-600",
      onClick: () => {} // Add order view functionality
    },
    {
      title: "Customer Reviews",
      value: stats.reviews,
      icon: <Star size={24} />,
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
      onClick: () => {} // Add review view functionality
    },
    {
      title: "Registered Customers",
      value: stats.customers,
      icon: <Users size={24} />,
      gradient: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      onClick: () => {} // Add customer view functionality
    }
  ];

  // Render order charts section
  const renderOrderCharts = () => {
    if (!orderData.monthly || orderData.monthly.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <p className="text-gray-500 text-center">No order data available</p>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 flex items-center">
          <BarChart2 className="h-6 w-6 mr-2 text-blue-600" />
          ORDER ANALYTICS
        </h2>

        {/* Time range selector */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setTimeRange("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                timeRange === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeRange("weekly")}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === "weekly"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeRange("daily")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                timeRange === "daily"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Daily
            </button>
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders over time chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Orders Over Time
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orderData[timeRange]}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" name="Number of Orders" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Revenue Trend
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={orderData.revenue}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                    name="Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categories chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <List className="h-5 w-5 mr-2 text-purple-600" />
              Orders by Category
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderData.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderData.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [
                    `${value} orders ($${props.payload.revenue.toFixed(2)})`,
                    name
                  ]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order status chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-yellow-600" />
              Order Status Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderData.status}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderData.status.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Stats Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 flex items-center">
          <Box className="h-6 w-6 mr-2 text-blue-600" />
          DASHBOARD OVERVIEW
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className={`${card.gradient} rounded-xl shadow-md p-6 text-white transition-all hover:shadow-lg cursor-pointer`}
              onClick={card.onClick}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">{card.title}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Analytics Section */}
      {renderOrderCharts()}

      {/* Products Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-600" />
              {selectedCategory ? `${selectedCategory} Products` : "All Products"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length} products found
            </p>
          </div>
          
          <div className="flex items-center w-full sm:w-auto gap-4">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchText}
                onChange={handleSearch}
              />
            </div>
            <Link
              to="/admin/addproduct"
              className="flex items-center gap-1 bg-blue-600 px-4 py-2 rounded-lg text-white text-sm hover:bg-blue-700"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Discount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th> 
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr> 
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {index + 1}  
                    </td>   
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            src={`data:${product.imageType};base64,${product.imageData}`} 
                            alt={product.productName}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{product.productType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1 text-gray-700" />
                        {product.productPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.productQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <Percent className="h-3 w-3 mr-1 text-gray-700" />
                        {product.discount || 0}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewProduct(product.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateProduct(product.id)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    {selectedCategory 
                      ? `No products found in ${selectedCategory} category`
                      : "No products found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
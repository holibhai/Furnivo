import React, { useState, useEffect, useRef } from "react";
import { Bell, LogOut, Settings, Menu } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const navigate=useNavigate();
  const [userDetail,setUserDetail]=useState([]);
 
  const handleClick=()=>{
      localStorage.removeItem('token');
      navigate("/login")
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/order/get", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data.orderDtoList || [];
        const filtered = data.filter((order) => order.orderStatus === "PENDING");
        setOrders(data);
        setPendingOrders(filtered);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(()=>{
    const fetchUser=async()=>{
          const userId=localStorage.getItem('userId');
          const res=await axios.get(`http://localhost:8080/api/user/getUser/${userId}`);
          setUserDetail(res.data.userAccountDto);

    }


    fetchUser();
  },[])

  return (
    <header className="fixed w-full top-0 left-0 z-40 bg-white shadow-md px-6 py-4 flex justify-between items-center border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Menu className="text-gray-600 cursor-pointer" size={24} />
      </div>

      <div className="flex items-center gap-6 relative">
        <div className="relative" ref={dropdownRef}>
          <Bell
            className="text-gray-600 hover:text-yellow-500 cursor-pointer"
            size={22}
            onClick={() => setShowNotifications((prev) => !prev)}
          />
          {pendingOrders.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
              {pendingOrders.length}
            </span>
          )}

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              <div className="p-4 border-b font-semibold text-gray-700">
                Pending Orders
              </div>
              {pendingOrders.length === 0 ? (
                <div className="p-4 text-gray-500 text-sm">No pending orders</div>
              ) : (
                pendingOrders.map((order, index) => (
                  <div key={index} className="px-4 py-2 hover:bg-gray-100 text-sm">
                    <p className="font-medium">Order #{order.orderId}</p>
                    <p className="text-gray-500">Status: {order.orderStatus}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Settings */}
        {/* <Settings className="text-gray-600 hover:text-blue-500 cursor-pointer" size={22} /> */}

        {/* Profile Image */}
        {/* <img
          src="https://i.pravatar.cc/40"
          alt="admin-profile"
          className="w-9 h-9 rounded-full border-2 border-yellow-400 object-cover shadow-md"
        /> */}
        <Link to="/admin/profile">
         <img 
        src={ userDetail && userDetail.imageData?`data:${userDetail.imageType};base64,${userDetail.imageData}`:"https://i.pravatar.cc/40"} 
          
         alt="admin-profile"
         className="w-9 h-9 rounded-full border-2 border-yellow-400 object-cover shadow-md"

        />
        </Link>
       

        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md transition"
        onClick={handleClick}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;

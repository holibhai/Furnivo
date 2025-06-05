import React, { useEffect, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import sideImage from "../assets/mid-century-modern-living-room-interior-design-with-monstera-tree_53876-129804.avif";
import { useAppContext } from "../context/AppContext";
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const CheckOut = () => {
  const navigate = useNavigate();
    const {cartItemCount,setCartItemCount}=useAppContext();
  
  // const [items, setItems] = useState({ cartItem: [] });
  const {items,setItems}=useAppContext();

  const [total, setTotal] = useState(0);
  const [offer, setOffer] = useState(0);
  const [netTotal, setNetTotal] = useState(0);

  const [cartItemsList,setCartItemList]=useState([]);

  const calculateTotals = (cartItems) => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );
    const offerAmount = cartItems.reduce(
      (sum, item) =>
        sum + (item.productPrice * item.discount * item.quantity) / 100,
      0
    );
    setTotal(totalAmount);
    setOffer(offerAmount);
    setNetTotal(totalAmount - offerAmount);
  };

  const fetchData = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await axios.get(
        `http://localhost:8080/api/cartItem/get/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const cartId=response.data.cartItemDtoList.map((item)=>item.id);
      setCartItemList(cartId)

      const cartItems = response.data.cartItemDtoList.map((item) => ({
        cartId:item.id,
        productId: item.productId,
        quantity: item.quantity,
      }));

      const fetchedProducts = await Promise.all(
        cartItems.map(async ({ productId, quantity }) => {
          try {
            const productResponse = await axios.get(
              `http://localhost:8080/api/product/${productId}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            return { ...productResponse.data, quantity };
          } catch (err) {
            console.error(`Error fetching product ${productId}:`, err);
            return null;
          }
        })
      );

      const validItems = fetchedProducts.filter((item) => item !== null);
      setItems({ cartItem: validItems });
      calculateTotals(validItems);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const decrementQuantity = async (item) => {
    const userId = localStorage.getItem("userId");
     if(item.quantity>1){
    try {
      const response = await axios.post(
        `http://localhost:8080/api/cartItem/decQuantity?productId=${item.id}&userId=${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        fetchData();
      }
    } catch (err) {
      console.error("Error decreasing quantity:", err.response?.data || err.message);
    }
  }else{
    toast.warning("Minimum one")
    // alert("you cant't decrease")
  }
}


  const incrementQuantity = async (productId) => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.post(
        `http://localhost:8080/api/cartItem/incQuantity?productId=${productId}&userId=${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        fetchData();
      }   
    } catch (err) {
      console.error("Error increasing quantity:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (productId) => {
    console.log(productId)
    try {
     const res= await axios.delete(
        `http://localhost:8080/api/cartItem/delete/cartItem/${productId}`,
        
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCartItemCount(cartItemCount=>setCartItemCount-1);
      toast.success("Product Deteled Successfully")
      
      console.log(res.data);
      fetchData();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const goToBilling = () => {
    navigate("/billing", {
      state: {
        total,
        offer,
        netTotal,
        cartItems: items.cartItem,
      },
    });
  };

  return (
    <div className="md:mt-56 mx-6 md:mx-12 lg:mx-24 mt-32">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/products" className="hover:text-blue-600">Products</Link>
              <span className="mx-2">/</span>
               <Link to="/product/:id" className="hover:text-blue-600">ProductDetail</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800 font-medium">{"checkout"}</span>
            </div>
                  <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="overflow-x-auto my-10">
        <table className="w-full shadow-lg rounded-lg overflow-hidden">
          <thead className="text-gray-700 uppercase text-sm">
            <tr>
              <th className="py-3 px-6 text-left">Product</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Offer</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Quantity</th>
              <th className="py-3 px-6 text-left">Subtotal</th>
              <th className="py-3 px-6 text-left"></th>
            </tr>  
          </thead>
          <tbody className=" text-sm">
            {items.cartItem.length > 0 ? (
              items.cartItem.map((item, index) => (
                <tr key={index} className="border-b hover:transition">
                  <td className="py-4 px-6">
                    <img
                      src={`data:${item.imageType};base64,${item.imageData}`}
                      alt={item.productName}
                      className="md:w-32 md:h-32  object-cover rounded-md "
                    />        
                  </td>
                  <td className="py-4 px-6">{item.productName}</td>
                  <td className="py-4 px-6">{item.discount || 0}%</td>
                  <td className="py-4 px-6">Rs.{item.productPrice}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-12 pb-4">
                      <div className="flex items-center bg-gray-600 my-3">
                        <button
                          onClick={() => decrementQuantity(item)}
                          className="p-2 bg-gray-400 shadow hover:bg-gray-200 transition"
                        >
                          <Minus size={18} className="text-gray-600" />
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-12 mx-2 text-center bg-transparent text-white text-lg font-semibold focus:outline-none"
                        />
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="p-2 bg-gray-400 shadow hover:bg-gray-200 transition"
                        >
                          <Plus size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium">
                    Rs.{item.productPrice * item.quantity}
                  </td>
                  <td>
                    <button
                      className="text-white p-2 bg-gray-400 rounded-full"
                      onClick={() => handleDelete(cartItemsList[index])}
                    >
                      <X className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No items in cart
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center my-10">
          <button
            className="bg-gray-700 p-4 text-white text-xs font-semibold"
            onClick={() => navigate("/shop")}
          >
            RETURN TO SHOP
          </button>
          {/* <button
            className="bg-gray-700 p-4 text-white text-xs font-semibold"
            onClick={fetchData}
          >
            UPDATE CART
          </button> */}
        </div>
      </div>

      <div className="flex mt-12 flex-col md:flex-row py-20">
        <div className="md:w-2/4 mb-6 md:mb-0 rounded-lg">
          <img src={sideImage} alt="Order Summary" className="rounded-lg" />
        </div>
        <div className="flex flex-col gap-2 md:w-2/4 text-right md:pl-20">
          <h1 className="text-3xl font-bold text-gray-600">ORDER TOTAL</h1>
          <div className="flex justify-between items-center mt-10 border-b border-gray-400 pb-5">
            <span className="text-gray-700 font-semibold">Total</span>
            <span className="text-gray-800">Rs. {total}</span>
          </div>
          <div className="flex justify-between items-center mt-10 border-b border-gray-400 pb-5">
            <span className="text-green-600 font-semibold">Offer</span>
            <span className="text-green-600">- Rs. {offer}</span>
          </div>
          <div className="flex justify-between items-center mt-10 border-b border-gray-400 pb-5">
            <span className="text-gray-700 font-bold">Net Total</span>
            <span className="text-gray-800 font-semibold">Rs. {netTotal}</span>
          </div>
          <button className="inline-flex items-center justify-center mt-10 bg-gray-700 px-9 py-3 text-white font-semibold text-sm" onClick={goToBilling}>
                NEXT
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;

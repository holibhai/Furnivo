import React, { useEffect, useState } from "react";
import PickUp from "./PickUp";
import Delivery from "./Delivery";
import image from "../assets/Yellow and White Modern Furniture Instagram Post.jpg";
import botImage from "../assets/Black and White Minimalist Simplify Vibes Twitter Header.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const stripePromise = loadStripe("pk_test_51RLzK4DBPjhydGB2EGG2SwUhN3QTQmkINMdP1LsCWxCi2i8iHV6E4zm7nCFvn9U8RUz2Oj3e2nIC6R8OGwydcZDL00TILxxyIs");

const Billing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { total, offer, netTotal, cartItems } = location.state || {};
  const userId = localStorage.getItem("userId");

  const [shippingCost, setShippingCost] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    user: { id: userId },
    delivery: {
      deliveryType: "PickUp",
      location: "",
      deliveryDate: "",
      pickUpOrderNotes: "",
      receiverFirstName: "",
      receiverLastName: "",
      city: "",
      receiverMobileNumber: "",
      streetAddress1: "",
      streetAddress2: "",
      deliveryOrderNotes: "",
    },
  });

  useEffect(() => {
    const fetchPrice = async () => {
      const city = billingData.delivery.city;
      if (billingData.delivery.deliveryType === "Delivery" && city) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/deliveryCharge/getPrice/${city}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setShippingCost(response.data.deliveryChargeDto.price || 0);
        } catch (error) {
          console.error("Failed to fetch delivery charge:", error);
        }
      } else {
        setShippingCost(0);
      }
    };

    fetchPrice();
  }, [billingData.delivery.city, billingData.delivery.deliveryType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeDelivery = (e) => {
    const { value } = e.target;
    setBillingData((prev) => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        deliveryType: value,
      },
    }));
  };

  const handlePickUpChange = (e) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        [name]: value,
      },
    }));
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        [name]: value,
      },
    }));
  };

  const validate = () => {
    const requiredFields = [
      billingData.firstName,
      billingData.lastName,
      billingData.email,
      billingData.mobileNumber
    ];

    if (requiredFields.some(field => !field)) {
      toast.error("Please fill all required personal information fields");
      return false;
    }

    if (billingData.delivery.deliveryType === "PickUp") {
      if (!billingData.delivery.deliveryDate || !billingData.delivery.location) {
        toast.error("Please select a pick-up location and date");
        return false;
      }
    } else {
      const deliveryRequiredFields = [
        billingData.delivery.receiverFirstName,
        billingData.delivery.receiverLastName,
        billingData.delivery.city,
        billingData.delivery.receiverMobileNumber,
        billingData.delivery.streetAddress1
      ];
      
      if (deliveryRequiredFields.some(field => !field)) {
        toast.error("Please fill all required delivery information fields");
        return false;
      }
    }

    return true;
  };

  const handleStripe = async (orderId) => {
    setIsProcessingPayment(true);
    try {
      const productLineItems = cartItems.map((item) => ({
        quantity: item.quantity,
        priceData: {
          currency: "lkr",
          unitAmount: Math.round(item.productPrice * 100),
          productData: {
            name: item.productName,
          },
        },
      }));

      if (billingData.delivery.deliveryType === "Delivery" && shippingCost > 0) {
        productLineItems.push({
          quantity: 1,
          priceData: {
            currency: "lkr",
            unitAmount: Math.round(shippingCost * 100),
            productData: {
              name: "Delivery Charge",
            },
          },
        });
      }

      const payload = {
        lineItems: productLineItems,
        orderId,
        customerEmail: billingData.email,
        offerAmount: offer ? Math.round(offer * 100) : 0,
        successUrl: `${window.location.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/order-canceled`,
      };

      const response = await axios.post(
        "http://localhost:8080/api/payment/create-checkout-session",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const sessionId = response.data.id;
      const stripe = await stripePromise;

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe redirect error:", error);
        navigate("/order-canceled");
      }
    } catch (error) {
      console.error("Payment processing failed:", error);
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleOrder = async () => {
    if (!validate()) return;

    try {
      const billingResponse = await axios.post(
        `http://localhost:8080/api/billing/add`,
        billingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (billingResponse.data.statusCode !== 201) {
        toast.error("Something went wrong while creating billing. Try again.");
        return;
      }

      const createdBillId = billingResponse.data.billingDto.id;

      const orderData = {
        netTotal: netTotal + shippingCost,
        offer: offer,
        deliveryType: billingData.delivery.deliveryType,
        user: { id: userId },
        billing: { id: createdBillId },
      };

      const orderResponse = await axios.post(
        `http://localhost:8080/api/order/add`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (orderResponse.data.statusCode !== 201) {
        toast.error("Something went wrong while creating order. Try again.");
        return;
      }

      const orderId = orderResponse.data.orderDto.id;

      for (const item of cartItems) {
        const orderItem = {
          quantity: item.quantity,
          subTotal: item.quantity * item.productPrice,
          productId: item.id,
        };

        await axios.post(
          `http://localhost:8080/api/orderItem/add/${orderId}`,
          orderItem,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      await handleStripe(orderId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again later.");
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className=" md:mx-28   py-12 md:mt-44 mx-5 mt-20">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Breadcrumbs */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <Link to="/products" className="hover:text-blue-600 transition">Products</Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <Link to="/checkout" className="hover:text-blue-600 transition">Checkout</Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li className="text-gray-800 font-medium">Billing</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Billing Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Billing Details</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={billingData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={billingData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={billingData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={billingData.mobileNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          <div className="relative rounded-xl overflow-hidden mb-8">
            <img src={image} alt="Promo" className="w-full  object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <Link 
                to="/offerProduct" 
                className="bg-white text-gray-800 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* Delivery Type Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Delivery Method</h1>

          <div className="flex space-x-6 mb-8 pb-6 border-b border-gray-200">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="deliveryType"
                value="PickUp"
                checked={billingData.delivery.deliveryType === "PickUp"}
                onChange={handleChangeDelivery}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Pick Up</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="deliveryType"
                value="Delivery"
                checked={billingData.delivery.deliveryType === "Delivery"}
                onChange={handleChangeDelivery}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Delivery</span>
            </label>
          </div>

          {billingData.delivery.deliveryType === "PickUp" ? (
            <PickUp
              location={billingData.delivery.location}
              pickUpDate={billingData.delivery.deliveryDate}
              pickUpOrderNotes={billingData.delivery.pickUpOrderNotes}
              handlePickUpChange={handlePickUpChange}
            />
          ) : (
            <Delivery
              receiverFirstName={billingData.delivery.receiverFirstName}
              receiverLastName={billingData.delivery.receiverLastName}
              city={billingData.delivery.city}
              receiverMobileNumber={billingData.delivery.receiverMobileNumber}
              streetAddress1={billingData.delivery.streetAddress1}
              streetAddress2={billingData.delivery.streetAddress2}
              deliveryOrderNotes={billingData.delivery.deliveryOrderNotes}
              handleDeliveryChange={handleDeliveryChange}
            />
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h1>
        
        <div className="divide-y divide-gray-200">
          {cartItems?.map((item, index) => (
            <div key={index} className="py-4 flex justify-between">
              <div className="text-gray-700">
                {item.productName} <span className="text-gray-500">x {item.quantity}</span>
              </div>
              <div className="text-gray-800">Rs.{(item.productPrice * item.quantity).toFixed(2)}</div>
            </div>
          ))}
          
          <div className="py-4 flex justify-between font-medium">
            <div className="text-gray-700">Subtotal</div>
            <div className="text-gray-800">Rs.{total?.toFixed(2)}</div>
          </div>
          
          <div className="py-4 flex justify-between font-medium">
            <div className="text-gray-700">Offer</div>
            <div className="text-red-500">-Rs.{offer?.toFixed(2)}</div>
          </div>
          
          <div className="py-4 flex justify-between font-medium">
            <div className="text-gray-700">Net Total</div>
            <div className="text-gray-800">Rs.{netTotal?.toFixed(2)}</div>
          </div>

          {billingData.delivery.deliveryType === "Delivery" && (
            <>
              <div className="py-4 flex justify-between">
                <div className="text-gray-700">Delivery to</div>
                <div className="text-gray-800">{billingData.delivery.city || "Not Selected"}</div>
              </div>
              <div className="py-4 flex justify-between">
                <div className="text-gray-700">Delivery Charge</div>
                <div className="text-gray-800">Rs.{shippingCost?.toFixed(2)}</div>
              </div>
            </>
          )}

          <div className="py-4 flex justify-between text-lg font-bold">
            <div className="text-gray-800">Total Amount</div>
            <div className="text-blue-600">Rs.{(netTotal + shippingCost)?.toFixed(2)}</div>
          </div>
        </div>

        <button
          className={`w-full mt-6 py-3 px-6 rounded-md font-medium text-white transition
            ${isProcessingPayment 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-gray-700 hover:bg-gray-800 shadow-md"}`}
          onClick={handleOrder}
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Place Order"
          )}
        </button>
      </div>

      {/* Bottom Banner */}
      <div className="mt-12 rounded-xl overflow-hidden">
        <img src={botImage} alt="Bottom Banner" className="w-full h-auto" />
      </div>
    </div>
  );
};

export default Billing;
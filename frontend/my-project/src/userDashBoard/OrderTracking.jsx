import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaCheckCircle,
  FaShippingFast,
  FaBox,
  FaHome,
  FaPhoneAlt,
} from "react-icons/fa";
import {
  CalendarRange,
  Star,
  MapPin,
  PhoneCall,
  Mail,
  FolderPen,
  BookOpenCheck,
  Building2,
  MapPinHouse,
  ShieldPlus,
} from "lucide-react";
const OrderTracking = () => {
  const [activeStage, setActiveStage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [orderDataa, setOrderDataa] = useState(null);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const { orderId } = useParams();
  const [orderNum,setOrderNum]=useState();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/order/getOrderByOrderId/${orderId}`
        );
        const order = res.data.orderDto;
        setOrderDataa(order);
        setOrderNum(res.data.orderDto.id);
        console.log(orderDataa);
        setActiveStage(getStageFromStatus(order.orderStatus));
      } catch (error) {
        console.error("Failed to fetch order", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {

        const response = await axios.get(
          `http://localhost:8080/api/order/get/${orderNum}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }

        );
      console.log(response.data);
         
        if (response.data.statusCode === 200) {
          const orderData = response.data.orderDto;
          console.log(orderData);
          setOrder(orderData);
          console.log(order);
          setStatus(orderData.status); // Set initial status

          const productPromises = orderData.orderItems.map(async (item) => {
            const productRes = await axios.get(
              `http://localhost:8080/api/product/${item.productId}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            return {
              ...item,
              productName: productRes.data.productName,
              product: productRes.data,
              category: productRes.data.category,
              price: productRes.data.productPrice,
            };
          });

          const updatedItems = await Promise.all(productPromises);
          setItems(updatedItems);

          console.log(items);
        }
      } catch (err) {
        console.error("Error fetching order or products", err);
      }
    };

    fetchOrder();
  }, [orderNum]);

  const getStageFromStatus = (status) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return 1;
      case "PROCESSING":
        return 2;
      case "SHIPPED":
        return 3;
      case "DELIVERED":
        return 5;
      default:
        return 1;
    }
  };

  const stages = [
    { id: 1, name: "Pending", icon: FaBox },
    { id: 2, name: "Processing", icon: FaCheckCircle },
    { id: 3, name: "Shipped", icon: FaShippingFast },
    { id: 5, name: "Delivered", icon: FaHome },
  ];

  const getStageColor = (stageId) => {
    if (stageId < activeStage) return "text-green-500";
    if (stageId === activeStage) return "text-blue-500";
    return "text-gray-300";
  };

  const getLineColor = (stageId) => {
    if (stageId < activeStage) return "bg-green-500";
    return "bg-gray-200";
  };

  if (!orderDataa) {
    return (
      <div className="text-center py-20 text-lg text-gray-700 dark:text-white">
        Loading order data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="px-4 md:px-12 lg:px-5">
        <div className="w-full bg-white rounded-xl shadow-lg p-4 md:p-6 dark:bg-gray-700">
          <h1 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">
            Order Status Tracking
          </h1>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Order Number
                </p>
                <p className="font-semibold text-orange-400 ">
                  #{orderDataa.orderId}
                </p>
              </div>
              
            </div>

          
          </div>

          <div className="relative">
            {/* Desktop View */}
            <div className="hidden md:flex justify-between items-center mb-8 w-full">
              {stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <div className="flex flex-col items-center group cursor-pointer">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getStageColor(
                        stage.id
                      )} bg-gray-100 dark:bg-gray-600 group-hover:scale-110 transition-transform`}
                      onClick={() => setActiveStage(stage.id)}
                    >
                      <stage.icon className="w-5 h-5" />
                    </div>
                    <p
                      className={`mt-2 text-sm font-medium ${getStageColor(
                        stage.id
                      )}`}
                    >
                      {stage.name}
                    </p>
                  </div>
                  {index < stages.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${getLineColor(
                        stages[index + 1].id
                      )}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {stages.map((stage) => (
                <div key={stage.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getStageColor(
                      stage.id
                    )} bg-gray-100 dark:bg-gray-600`}
                    onClick={() => setActiveStage(stage.id)}
                  >
                    <stage.icon className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p
                      className={`text-sm font-medium ${getStageColor(
                        stage.id
                      )}`}
                    >
                      {stage.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <FaPhoneAlt className="mr-2" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
      <div className=" md:px-12 lg:px-5 my-10">
        <div className="rounded-2xl p-6 border border-gray-300 bg-white">
          <div className="flex justify-between items-center">
            <p className="text-3xl font-bold text-gray-800">Order Detail</p>
            {order && (
              <div className="flex flex-col gap-1 items-end">
                <p className="font-medium uppercase text-orange-600 bg-yellow-300 rounded-xl px-2 py-1 text-sm">
                  OrderId #{order.orderId}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <CalendarRange className="w-[15px] text-gray-500" />
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-3 my-4 border-b border-gray-300 pb-5 items-center">
            <span className="text-xs text-green-500 bg-green-200 px-2 py-1 rounded-md font-medium">
              Paid
            </span>
            <span className="text-xs text-blue-500 bg-blue-200 px-2 py-1 rounded-md font-medium">
              Fulfilled
            </span>
            {order && (
              <span className="text-xs text-gray-500 bg-yellow-300 px-2 py-1 rounded-md font-medium">
                <CalendarRange className="inline w-[13px] mr-2" />
                {new Date(order.orderDate).toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex gap-6 mt-6">
            {/* Product Details */}
            <div className="border border-gray-300 w-2/3 rounded-lg p-4">
              <h1 className="text-base font-medium text-gray-700 p-1 border-b pb-4 flex justify-between items-center">
                <div>
                  Product Details
                  <span className="ml-1 bg-gray-300 rounded-full px-1 text-sm">
                    {items.length}
                  </span>
                </div>
                
              </h1>

              <div className="py-3 overflow-x-auto">
                <table className="w-full text-sm text-gray-700">
                  <thead>
                    <tr>
                      <th className="text-left pb-4">Product</th>
                      <th className="text-right pb-4">Price</th>
                      <th className="text-right pb-4">Quantity</th>
                      <th className="text-right pb-4">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-2">
                          <div className="flex items-center gap-4">
                            <img
                              src={`data:${item.product.imageType};base64,${item.product.imageData}`}
                              alt={item.productName}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div>
                              <p className="text-blue-600 font-medium text-xs uppercase">
                                {item.productName}
                              </p>
                              <p className="text-xs font-medium">
                                {item.category} Item
                              </p>
                              <p className="flex items-center">
                                {[1, 2, 3, 4].map((i) => (
                                  <Star
                                    key={i}
                                    className="fill-orange-400 stroke-yellow-500 w-[11px]"
                                  />
                                ))}
                                <Star className="w-[11px] fill-gray-400" />
                                <span className="text-orange-400 font-semibold ml-1">
                                  4.0
                                </span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right">Rs. {item.price}</td>
                        <td className="text-right">{item.quantity}x</td>
                        <td className="text-right">Rs. {item.subTotal}</td>
                      </tr>
                    ))}

                    {order && (
                      <>
                        <tr>
                          <td colSpan={2}></td>
                          <td className="text-right font-medium py-3">Total</td>
                          <td className="text-right">
                            Rs. {order.netTotal + (order.offer || 0)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}></td>
                          <td className="text-right font-medium py-3">Offer</td>
                          <td className="text-right text-green-500">
                            -Rs. {order.offer || 0}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}></td>
                          <td className="text-right font-medium py-3">
                            Net Total
                          </td>
                          <td className="text-right font-semibold underline">
                            Rs. {order.netTotal || 0}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User & Delivery Details */}
            <div className="border border-gray-300 w-1/3 rounded-lg p-4">
              <h2 className="text-base font-medium text-gray-700 mb-4 border-b pb-4 flex justify-between items-center">
                <span>User Details</span>
                 
              </h2>

              <div className="flex items-center justify-between border-b pb-3 text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-yellow-400 shadow-md"
                  />
                  <span>
                    {order?.billing?.user?.firstName}{" "}
                    {order?.billing?.user?.lastName}
                  </span>
                </div>
                <span className="text-xs text-gray-700">
                  {order?.billing?.user?.username}
                </span>
              </div>

              <div className="my-4 border-b pb-4 text-sm text-gray-600">
                <h3 className="text-base font-medium text-gray-700 mb-2 flex justify-between">
                  <span>Delivery Type</span>
                  <span className="bg-blue-300 px-2 rounded text-blue-700">
                    {order?.billing?.delivery?.deliveryType}
                  </span>
                </h3>

                {order?.billing?.delivery?.deliveryType === "PickUp" ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <span>
                        <MapPin className="inline w-[15px] mr-1 text-red-500" />
                        Pick Up Location
                      </span>
                      <span>{order?.billing?.delivery?.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <CalendarRange className="inline w-[15px] mr-1 text-orange-500" />
                        Pick Up Date
                      </span>
                      <span>{order?.billing?.delivery?.deliveryDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <span>
                        <BookOpenCheck className="inline w-[15px] mr-1 text-red-500" />
                        First Name
                      </span>
                      <span>{order?.billing?.delivery?.receiverFirstName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <FolderPen className="inline w-[15px] mr-1 text-red-500" />
                        Last Name
                      </span>
                      <span>{order?.billing?.delivery?.receiverLastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <Building2 className="inline w-[15px] mr-1 text-red-500" />
                        City
                      </span>
                      <span>{order?.billing?.delivery?.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <PhoneCall className="inline w-[15px] mr-1 text-red-500" />
                        Receiver Mobile Number
                      </span>
                      <span>
                        {order?.billing?.delivery?.receiverMobileNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <MapPinHouse className="inline w-[15px] mr-1 text-red-500" />
                        Street Address 1
                      </span>
                      <span>{order?.billing?.delivery?.streetAddress1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <ShieldPlus className="inline w-[15px] mr-1 text-orange-500" />
                        Street Address 2
                      </span>
                      <span>{order?.billing?.delivery?.streetAddress2}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600">
                <h3 className="text-base font-medium text-gray-700 mb-2 flex justify-between">
                  <span>Billing Details</span>
                   
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    <span>
                      <FolderPen className="inline w-[15px] mr-1 text-red-500" />
                      First Name
                    </span>
                    <span>{order?.billing?.firstName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      <BookOpenCheck className="inline w-[15px] mr-1 text-red-500" />
                      Last Name
                    </span>
                    <span>{order?.billing?.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      <Mail className="inline w-[15px] mr-1 text-red-500" />
                      Email
                    </span>
                    <span>{order?.billing?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      <PhoneCall className="inline w-[15px] mr-1 text-red-500" />
                      Mobile Number
                    </span>
                    <span>{order?.billing?.mobileNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

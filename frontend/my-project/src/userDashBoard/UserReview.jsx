import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Star,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  User,
  MessageSquare,
  CheckCircle
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserReview = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [reviewForms, setReviewForms] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState({});
  const [expandedReviews, setExpandedReviews] = useState({});
  const [productReviews, setProductReviews] = useState({});
  const [loadingReviews, setLoadingReviews] = useState({});
  const userId = localStorage.getItem("userId");

  // Fetch user's orders with delivered products that haven't been reviewed yet
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/order/getAllOrders/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.statusCode === 200) {
          const orders = response.data.orderDtoList || [];
          const unreviewedItems = [];

          for (const order of orders) {
            if (order.orderStatus === "DELIVERED") {
              for (const item of order.orderItems) {
                // Check if user already reviewed this product
                try {
                  const reviewRes = await axios.get(
                    `http://localhost:8080/api/review/user/${userId}/product/${item.productId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    }
                  );
                  
                  // If review exists, skip this product
                  if (reviewRes.data) {
                    continue;
                  }
                } catch (error) {
                  // Review doesn't exist yet, proceed to add this product
                }

                const productRes = await axios.get(
                  `http://localhost:8080/api/product/${item.productId}`,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );

                unreviewedItems.push({
                  ...item,
                  orderId: order.orderId,
                  orderDate: order.orderDate,
                  productId: item.productId,
                  productName: productRes.data.productName,
                  product: productRes.data
                });
              }
            }
          }

          setOrderItems(unreviewedItems);
        }
      } catch (error) {
        console.error("Failed to fetch delivered products", error);
        toast.error("Failed to load your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // Fetch product reviews when expanded
  const fetchProductReviews = async (productId) => {
    try {
      setLoadingReviews(prev => ({ ...prev, [productId]: true }));
      const response = await axios.get(
        `http://localhost:8080/api/review/product/${productId}`
      );
      
      if (response.data) {
        setProductReviews(prev => ({
          ...prev,
          [productId]: response.data
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch reviews for product ${productId}`, error);
      toast.error(`Failed to load reviews for this product.`);
    } finally {
      setLoadingReviews(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleToggleReview = (productId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));

    // Fetch reviews if not already loaded
    if (!productReviews[productId] && !expandedReviews[productId]) {
      fetchProductReviews(productId);
    }
  };

  const handleToggleForm = (productId) => {
    setReviewForms(prev => ({
      ...prev,
      [productId]: prev[productId] ? null : { rating: 0, comment: "" },
    }));
  };

  const handleRatingChange = (productId, rating) => {
    setReviewForms(prev => ({
      ...prev,
      [productId]: { ...prev[productId], rating },
    }));
  };

  const handleCommentChange = (productId, comment) => {
    setReviewForms(prev => ({
      ...prev,
      [productId]: { ...prev[productId], comment },
    }));
  };

  const handleSubmitReview = async (productId) => {
    const review = reviewForms[productId];
    if (!review.rating) {
      toast.warning("Please select a rating before submitting.");
      return;
    }

    try {
      setSubmitting(prev => ({ ...prev, [productId]: true }));
      await axios.post(
        "http://localhost:8080/api/review/add",
        {
          userId,
          productId,
          rating: review.rating,
          comment: review.comment,
          status:"not post"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // Remove the reviewed product from the list
      setOrderItems(prev => prev.filter(item => item.productId !== productId));

      toast.success("Review submitted successfully!");
      setReviewForms(prev => ({ ...prev, [productId]: null }));
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 ">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="">
        <div className=" mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Your Purchases</h1>
          <p className="text-base text-gray-600">
            Share your experience with products you've purchased
          </p>
        </div>

        {orderItems.length === 0 ? (
          <div className="rounded-lg shadow p-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No products left to review
            </h3>
            <p className="mt-2 text-gray-600">
              You've reviewed all your delivered products. Thank you for your feedback!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orderItems.map((item) => (
              <div
                key={`${item.orderId}-${item.productId}`}
                className=" rounded-xl border border-gray-300 overflow-hidden transition-all duration-200 hover:shadow-lg"
              >
                <div className="p-6 bg-gray-200">
                  <div className=" flex flex-col items-start md:flex-row  gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={`data:${item.product.imageType};base64,${item.product.imageData}`}
                        alt={item.productName}
                        className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                    <div className="flex-1 items-start justify-start">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Ordered on {formatDate(item.orderDate)}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Delivered
                        </span>
                      </div>

                      {/* Product Rating Summary */}
                      <div className="mt-3 flex items-center">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={`${
                                star <= Math.round(calculateAverageRating(productReviews[item.productId]))
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill={
                                star <= Math.round(calculateAverageRating(productReviews[item.productId]))
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {calculateAverageRating(productReviews[item.productId])} ({productReviews[item.productId]?.length || 0} reviews)
                        </span>
                      </div>  

                      {/* Review Section */}
                      <div className="mt-4">
                        {reviewForms[item.productId] ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rate this product
                              </label>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingChange(item.productId, star)} 
                                    className={`p-1 rounded-full ${ 
                                      star <= reviewForms[item.productId].rating 
                                        ? "text-yellow-400" 
                                        : "text-gray-300"
                                    } hover:text-yellow-500 focus:outline-none`} 
                                  > 
                                    <Star 
                                      size={24}
                                      fill={ 
                                        star <= reviewForms[item.productId].rating
                                          ? "currentColor" 
                                          : "none" 
                                      } 
                                    /> 
                                  </button> 
                                ))} 
                              </div> 
                            </div> 
                            <div> 
                              <label className="block text-sm font-medium text-gray-700 mb-1"> 
                                Write your review 
                              </label> 
                              <textarea 
                                rows={3} 
                                className="w-full border  border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Share your experience with this product..." 
                                value={reviewForms[item.productId].comment} 
                                onChange={(e) => handleCommentChange(item.productId, e.target.value)}
                              />
                            </div>
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => handleToggleForm(item.productId)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSubmitReview(item.productId)}
                                disabled={submitting[item.productId]}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-75"
                              >
                                {submitting[item.productId] ? (
                                  <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 inline" />
                                    Submitting...
                                  </>
                                ) : (
                                  "Submit Review"
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleToggleForm(item.productId)}
                              className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              Write a Review
                            </button>
                            <button
                              onClick={() => handleToggleReview(item.productId)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                            >
                              {expandedReviews[item.productId] ? (
                                <>
                                  Hide reviews <ChevronUp className="ml-1 h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  See all reviews <ChevronDown className="ml-1 h-4 w-4" />
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Expanded Reviews Section */}
                      {expandedReviews[item.productId] && (
                        <div className="mt-4 space-y-4">
                          {/* Other Reviews */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3 flex flex-row items-center">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Customer Reviews
                            </h4>
                            {loadingReviews[item.productId] ? (
                              <div className="flex justify-center py-4">
                                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                              </div>
                            ) : productReviews[item.productId]?.length > 0 ? (
                              productReviews[item.productId].map((review, index) => (
                                <div key={index} className="p-4 bg-gray-300 rounded-lg mb-3">
                                  <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                      <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <span className="font-medium">
                                      {review.user?.username || 'Anonymous'}
                                    </span>
                                    <div className="ml-auto flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          size={14}
                                          className={`${
                                            star <= review.rating
                                              ? "text-yellow-400"
                                              : "text-gray-300"
                                          }`}
                                          fill={
                                            star <= review.rating
                                              ? "currentColor"
                                              : "none"
                                          }
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-gray-700 mt-2">
                                    {review.comment || "No comment provided"}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    Reviewed on {formatDate(review.createdAt)}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 py-2 text-center">
                                No reviews yet
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReview;
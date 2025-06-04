import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2,
  Star,
  Search,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = ['All', 'post', 'not post'];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          'http://localhost:8080/api/review/getAll',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setReviews(response.data);
        setFilteredReviews(response.data);
        
        const productIds = [...new Set(response.data.map(review => review.productId))];
        await fetchProducts(productIds);
      } catch (err) {
        console.error('Failed to fetch reviews', err);
        setError('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProducts = async (productIds) => {
      try {
        const productPromises = productIds.map(id => 
          axios.get(`http://localhost:8080/api/product/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
        );
        
        const productResponses = await Promise.all(productPromises);
        const productsMap = {};
        productResponses.forEach(response => {
          productsMap[response.data.id] = response.data;
        });
        setProducts(productsMap);
      } catch (err) {
        console.error('Failed to fetch products', err);
        setError('Failed to load product details');
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    let filtered = reviews.filter(review => {
      const matchesSearch = 
        review.comment?.toLowerCase().includes(searchText.toLowerCase()) ||
        (products[review.productId]?.productName?.toLowerCase().includes(searchText.toLowerCase())) ||
        review.productId.toString().includes(searchText);
      
      const matchesStatus = 
        selectedStatus === 'All' || 
        (selectedStatus === 'post' && (review.status === 'post' || !review.status)) ||
        (selectedStatus === 'not post' && review.status === 'not post');
      
      return matchesSearch && matchesStatus;
    });
    setFilteredReviews(filtered);
  }, [searchText, selectedStatus, reviews, products]);

  const handleStatusToggle = async (reviewId, currentStatus) => {
    try {
      setIsLoading(true);
      const newStatus = currentStatus === 'post' ? 'not post' : 'post';
      
      await axios.put(
        `http://localhost:8080/api/review/updateStatus/${reviewId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, status: newStatus } : review
      ));
    } catch (err) {
      console.error('Failed to update review status', err);
      setError('Failed to update review status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      setIsLoading(true);
      await axios.delete(
        `http://localhost:8080/api/review/delete/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (err) {
      console.error('Failed to delete review', err);
      setError('Failed to delete review');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 stroke-yellow-500' : 'stroke-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openReviewModal = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const StatusToggle = ({ isActive, onChange }) => {
    return (
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isActive ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        onClick={onChange}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isActive ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    );
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Customer Reviews</h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reviews or products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="flex items-center justify-between w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <span>{selectedStatus}</span>
              {isStatusOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {isStatusOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                {statusOptions.map((option) => (
                  <div
                    key={option}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedStatus(option);
                      setIsStatusOpen(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-start">
            <div className="text-red-800 font-medium">{error}</div>
          </div>
        )}

        {/* Reviews Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                ) : filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => {
                    const product = products[review.productId];
                    const isActive = review.status === 'post' || !review.status;
                    return (
                      <tr 
                        key={review.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => openReviewModal(review)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {review.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex items-center">
                            {product?.imageData ? (
                              <img 
                                src={`data:${product.imageType};base64,${product.imageData}`} 
                                alt={product.productName}
                                className="h-10 w-10 rounded-md object-cover mr-2"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 mr-2 flex items-center justify-center">
                                <span className="text-xs text-gray-500">No Image</span>
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{product?.productName || `Product ID: ${review.productId}`}</div>
                              <div className="text-xs text-gray-500">ID: {review.productId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {renderStars(review.rating)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                          {review.comment || 'No comment'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(review.createdDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <StatusToggle
                              isActive={isActive}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleStatusToggle(review.id, review.status || 'post');
                              }}
                            />
                            <span className="text-sm">
                              {isActive ? 'Posted' : 'Not Posted'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteReview(review.id);
                              }}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No reviews found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Detail Modal */}
        {isModalOpen && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-xl font-semibold">Review Details</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Review ID</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedReview.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date</h3>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedReview.createdDate)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                    <div className="mt-1">
                      {renderStars(selectedReview.rating)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusToggle
                        isActive={selectedReview.status === 'post' || !selectedReview.status}
                        onChange={() => handleStatusToggle(selectedReview.id, selectedReview.status || 'post')}
                      />
                      <span className="text-sm">
                        {(selectedReview.status === 'post' || !selectedReview.status) ? 'Posted' : 'Not Posted'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500">Product</h3>
                  {products[selectedReview.productId] ? (
                    <div className="mt-2 flex items-center">
                      <img 
                        src={`data:${products[selectedReview.productId].imageType};base64,${products[selectedReview.productId].imageData}`} 
                        alt={products[selectedReview.productId].productName}
                        className="h-16 w-16 rounded-md object-cover mr-4"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {products[selectedReview.productId].productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {selectedReview.productId}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">Product ID: {selectedReview.productId}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Comment</h3>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedReview.comment || 'No comment provided'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t px-4 py-3 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
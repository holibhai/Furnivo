import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const discountRanges = [
  { label: "Less than 10%", value: "10", min: 0, max: 10 },
  { label: "10% - 20%", value: "20", min: 10, max: 20 },
  { label: "20% - 30%", value: "30", min: 20, max: 30 },
  { label: "30% - 50%", value: "50", min: 30, max: 50 },
  { label: "More than 50%", value: "90", min: 50, max: 100 },
];

const OfferList = () => {
  const { offer, setOffer, resetFilters } = useAppContext();
  const navigate = useNavigate();

  const handleOfferChange = (event) => {
    const selectedValue = event.target.value;
    setOffer(selectedValue === offer ? null : selectedValue); 
  };

  const handleClearFilter = () => {
    setOffer(null);
  };

  return (
    <div className="w-64 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Discount Offers</h2>
        {offer && (
          <button
            onClick={handleClearFilter}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {discountRanges.map((range) => (
          <li key={range.value} className="py-2">
            <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="discountOffer"
                value={range.value}
                checked={offer === range.value}
                onChange={handleOfferChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                {range.label}
              </span>
              {offer === range.value && (
                <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Selected
                </span>
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OfferList;
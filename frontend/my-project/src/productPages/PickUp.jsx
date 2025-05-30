import React, { useState, useEffect } from "react";

const locations = [
  {
    id: "loc1",
    name: "Downtown Branch",
    address: "123 Main Street, Downtown, City 45678",
    mapsUrl: "https://www.google.com/maps?q=123+Main+Street,+Downtown,+City+45678",
    hours: "Mon-Fri: 9AM-7PM | Sat-Sun: 10AM-5PM"
  },
  {
    id: "loc2",
    name: "Westside Hub",
    address: "456 West Avenue, Westside, City 78901",
    mapsUrl: "https://www.google.com/maps?q=456+West+Avenue,+Westside,+City+78901",
    hours: "Mon-Sat: 8AM-8PM | Sun: 11AM-4PM"
  },
  {
    id: "loc3",
    name: "Uptown Store",
    address: "789 Uptown Road, Uptown, City 23456",
    mapsUrl: "https://www.google.com/maps?q=789+Uptown+Road,+Uptown,+City+23456",
    hours: "Daily: 10AM-6PM"
  },
];

const PickUp = ({
  location, 
  deliveryDate,   
  pickUpOrderNotes,                    
  handlePickUpChange,    
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (location) {
      const found = locations.find((loc) => loc.address === location);
      if (found) setSelectedLocation(found);
    }
  }, [location]);

  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    handlePickUpChange({
      target: {
        name: "location",
        value: loc.address,
      },
    });
  };

  return (
    <div className="bg-white  rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-xl font-bold text-gray-800 mb-2">Pick Up Details</h1>
      <p className="text-gray-500 text-sm mb-6">Choose your preferred location and pick-up time</p>

      <div className="mb-8">
        <h2 className="text-gray-700 font-medium mb-4">Select a Pick-Up Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => handleLocationSelect(loc)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 h-full flex flex-col
                ${
                  selectedLocation?.id === loc.id
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-blue-300"
                }`}
            >
              <div className="flex-grow">
                <h3 className="text-gray-800 font-medium text-lg mb-2">{loc.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{loc.address}</p>
                <p className="text-xs text-gray-500 mb-4">{loc.hours}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(loc.mapsUrl, "_blank");
                }}
                className="self-start text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View on Map
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedLocation && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-700 font-medium mb-1">Selected Location</h3>
              <p className="text-gray-800 font-medium">{selectedLocation.name}</p>
              <p className="text-gray-600 text-sm">{selectedLocation.address}</p>
              <p className="text-gray-500 text-xs mt-1">{selectedLocation.hours}</p>
            </div>
            <button
              onClick={() => window.open(selectedLocation.mapsUrl, "_blank")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Directions
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="pickUpDate" className="block text-sm font-medium text-gray-700 mb-1">
            Pick Up Date
          </label>
          <input
            type="date"
            id="pickUpDate"
            name="deliveryDate"
            value={deliveryDate}
            onChange={handlePickUpChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="pickUpOrderNotes" className="block text-sm font-medium text-gray-700 mb-1">
          Order Notes (Optional)
        </label>
        <textarea
          id="pickUpOrderNotes"
          name="pickUpOrderNotes"
          value={pickUpOrderNotes}
          onChange={handlePickUpChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px]"
          placeholder="Special instructions, contact preferences, etc..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default PickUp;
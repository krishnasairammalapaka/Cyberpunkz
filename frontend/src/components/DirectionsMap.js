import React from 'react';

const DirectionsMap = ({ destination, destinationName }) => {
  if (!destination) {
    return null;
  }

  // Using OpenStreetMap static image
  const zoom = 15;
  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${destination.lat},${destination.lng}&zoom=${zoom}&size=800x400&markers=${destination.lat},${destination.lng},red`;
  
  return (
    <div className="relative">
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg bg-gray-100">
        <div className="relative w-full h-full">
          <img
            src={mapUrl}
            alt={`Map showing location of ${destinationName}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/800x400?text=Map+Currently+Unavailable";
            }}
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
            <p className="text-sm font-medium text-gray-700">{destinationName}</p>
          </div>
        </div>
      </div>

      {/* Location details below the map */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-2">Location Details</h3>
        <p className="text-gray-600">
          <span className="font-medium">Name:</span> {destinationName}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Coordinates:</span> {destination.lat.toFixed(6)}, {destination.lng.toFixed(6)}
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${destination.lat},${destination.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium text-center"
          >
            Get Directions (Google Maps)
          </a>
          <a
            href={`https://www.openstreetmap.org/?mlat=${destination.lat}&mlon=${destination.lng}&zoom=${zoom}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium text-center"
          >
            View on OpenStreetMap
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Click either button above to get detailed directions or view the interactive map
        </p>
      </div>
    </div>
  );
};

export default DirectionsMap; 
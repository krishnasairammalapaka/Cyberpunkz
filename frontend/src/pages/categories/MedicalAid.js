import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import DirectionsMap from '../../components/DirectionsMap';

function MedicalAid() {
  const [selectedCause, setSelectedCause] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const medicalCauses = [
    {
      id: 'med1',
      name: 'Emergency Medical Relief',
      image: 'https://images.unsplash.com/photo-1584744763688-f4ba535f3dfb?auto=format&fit=crop&w=1000&q=80',
      description: 'Provide emergency medical supplies and care to disaster-affected areas',
      ethAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      targetAmount: 50000,
      raisedAmount: 32000,
      location: {
        lat: 9.5121,
        lng: 77.6340
      }
    },
    {
      id: 'med2',
      name: 'Children\'s Hospital Support',
      image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1000&q=80',
      description: 'Support pediatric care and medical equipment for children\'s hospitals',
      ethAddress: '0x823...456',
      targetAmount: 75000,
      raisedAmount: 45000,
      location: {
        lat: 34.0522,
        lng: -118.2437
      }
    },
    {
      id: 'med3',
      name: 'Rural Healthcare Access',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80',
      description: 'Establish mobile clinics and healthcare facilities in rural areas',
      ethAddress: '0x567...890',
      targetAmount: 60000,
      raisedAmount: 28000,
      location: {
        lat: 51.5074,
        lng: -0.1278
      }
    }
  ];

  const handleShowMap = (cause) => {
    setSelectedCause(cause);
    setShowMap(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Medical Aid Initiatives</h1>
          <p className="text-xl text-gray-600">Support healthcare projects worldwide</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {medicalCauses.map((cause) => (
            <motion.div
              key={cause.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={cause.image}
                  alt={cause.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{cause.name}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">{cause.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-blue-600 font-semibold">
                      {Math.round((cause.raisedAmount / cause.targetAmount) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cause.raisedAmount / cause.targetAmount) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Raised: ${cause.raisedAmount.toLocaleString()}</span>
                    <span className="text-gray-600">Goal: ${cause.targetAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    to={`/donate?cause=${cause.id}&category=medical`}
                    className="block"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                    >
                      Donate Now
                    </motion.button>
                  </Link>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleShowMap(cause)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
                  >
                    View Location
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map Modal */}
        <AnimatePresence>
          {showMap && selectedCause && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowMap(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-xl p-6 w-full max-w-4xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{selectedCause.name} - Location</h3>
                  <button
                    onClick={() => setShowMap(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <DirectionsMap
                  destination={selectedCause.location}
                  destinationName={selectedCause.name}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MedicalAid; 
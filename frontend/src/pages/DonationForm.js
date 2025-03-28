import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Web3 from 'web3';
import { transactionService } from '../services/transactionService';

function DonationForm() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCharity, setSelectedCharity] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [charities, setCharities] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('USD');
  const [ethRate, setEthRate] = useState(null);
  const [ethAmount, setEthAmount] = useState('0');
  const [loadingRate, setLoadingRate] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Predefined donation amounts
  const suggestedAmounts = [10, 25, 50, 100, 500, 1000];

  // Categories with their respective images and descriptions
  const categories = [
    {
      id: 'medical',
      name: 'Medical Aid',
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1000&q=80',
      description: 'Support healthcare initiatives and medical treatments'
    },
    {
      id: 'education',
      name: 'Education',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
      description: 'Help provide education to underprivileged children'
    },
    {
      id: 'environment',
      name: 'Environment',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
      description: 'Support environmental conservation efforts'
    },
    {
      id: 'hunger',
      name: 'Food & Hunger',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
      description: 'Help fight hunger and provide food security'
    },
    {
      id: 'animals',
      name: 'Animal Welfare',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80',
      description: 'Support animal rescue and welfare programs'
    },
    {
      id: 'orphanage',
      name: 'Orphanage Care',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
      description: 'Help provide care for orphaned children'
    }
  ];

  // Predefined charities with more details
  const predefinedCharities = [
    {
      id: 'ch1',
      name: 'Global Health Initiative',
      category: 'medical',
      description: 'Providing medical care in underserved areas',
      ethAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    },
    {
      id: 'ch2',
      name: 'Education for All Foundation',
      category: 'education',
      description: 'Supporting education in developing countries',
      ethAddress: '0x123...789'
    },
    {
      id: 'ch3',
      name: 'Wildlife Protection Fund',
      category: 'animals',
      description: 'Protecting endangered species worldwide',
      ethAddress: '0xabc...xyz'
    },
    // Add more predefined charities...
  ];

  useEffect(() => {
    fetchCharities();
    fetchEthPrice();
    initializeWeb3();
  }, []);

  const fetchCharities = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/charities`);
      const data = await response.json();
      setCharities(data);
    } catch (error) {
      console.error('Error fetching charities:', error);
    }
  };

  const fetchEthPrice = async () => {
    setLoadingRate(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${currency.toLowerCase()}`
      );
      const data = await response.json();
      setEthRate(data.ethereum[currency.toLowerCase()]);
    } catch (error) {
      console.error('Error fetching ETH price:', error);
    } finally {
      setLoadingRate(false);
    }
  };

  // Calculate ETH amount when fiat amount changes
  useEffect(() => {
    if (ethRate && amount) {
      const ethValue = parseFloat(amount) / ethRate;
      setEthAmount(ethValue.toFixed(6));
    }
  }, [amount, ethRate]);

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Get the user's account
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

      } catch (error) {
        console.error("Error initializing Web3:", error);
      }
    } else {
      console.error("Please install MetaMask!");
    }
  };

  const handleDonation = async (e) => {
    e.preventDefault();
    if (!web3 || !account) {
      alert("Please connect your MetaMask wallet first!");
      return;
    }

    setProcessing(true);
    let transactionData = null;
    let receipt = null;

    try {
      const selectedCharityData = predefinedCharities.find(c => c.id === selectedCharity);
      if (!selectedCharityData) {
        throw new Error("Please select a charity");
      }

      const ethAmountWei = web3.utils.toWei(ethAmount.toString(), 'ether');
      
      // Create initial transaction record with 'pending' status
      transactionData = {
        donor_id: user.id,
        charity_id: selectedCharity,
        amount: parseFloat(amount),
        eth_amount: parseFloat(ethAmount),
        status: 'pending',
        message: message,
        transaction_hash: null,
        charities: {
          name: selectedCharityData.name,
          eth_address: selectedCharityData.ethAddress
        }
      };

      // Save initial transaction
      const savedTransaction = await transactionService.saveTransaction(transactionData);
      transactionData = savedTransaction; // Update with saved version that includes ID

      // Send ETH using web3
      receipt = await web3.eth.sendTransaction({
        from: account,
        to: selectedCharityData.ethAddress,
        value: ethAmountWei,
        gas: 300000
      });

      // Update transaction with hash and completed status
      await transactionService.updateTransactionStatus(
        receipt.transactionHash,
        'completed'
      );

      navigate('/transactions');
    } catch (error) {
      console.error('Error processing donation:', error);
      
      // Update transaction status to failed if it was created
      if (transactionData && transactionData.id) {
        await transactionService.updateTransactionStatus(
          receipt?.transactionHash || transactionData.transaction_hash,
          'failed'
        );
      }
      
      alert('Error processing donation. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    // Navigate to the appropriate category page
    switch(categoryId) {
      case 'medical':
        navigate('/categories/medical-aid');
        break;
      case 'education':
        navigate('/categories/education');
        break;
      case 'environment':
        navigate('/categories/environment');
        break;
      case 'hunger':
        navigate('/categories/food-aid');
        break;
      case 'animals':
        navigate('/categories/animal-welfare');
        break;
      case 'orphanage':
        navigate('/categories/orphanage-support');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <motion.div 
        className="container mx-auto px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Make a Donation</h1>
          <p className="text-xl text-gray-600">Choose a cause you want to support</p>
        </motion.div>

        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Select Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                className={`relative rounded-xl overflow-hidden cursor-pointer ${
                  selectedCategory === category.id ? 'ring-4 ring-blue-500' : ''
                }`}
                whileHover={{ y: -5 }}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="relative h-48">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm text-gray-200">{category.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Updated Donation Form */}
        <motion.div 
          className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleDonation} className="space-y-6">
            {/* Enhanced Charity Selection */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block text-gray-700 text-lg font-semibold mb-3">
                Select Charity
              </label>
              <div className="space-y-4">
                {predefinedCharities
                  .filter(charity => selectedCategory === 'all' || charity.category === selectedCategory)
                  .map((charity) => (
                    <motion.div
                      key={charity.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedCharity === charity.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedCharity(charity.id)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-800">{charity.name}</h3>
                          <p className="text-sm text-gray-600">{charity.description}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">ETH Address:</span>
                          <span className="text-xs font-mono bg-gray-100 p-1 rounded">
                            {`${charity.ethAddress.slice(0, 6)}...${charity.ethAddress.slice(-4)}`}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>

            {/* Currency and Amount Selection */}
            <div className="space-y-4">
              <label className="block text-gray-700 text-lg font-semibold mb-3">
                Select Currency
              </label>
              <div className="flex gap-4 mb-6">
                {['USD', 'EUR', 'GBP', 'ETH'].map((curr) => (
                  <motion.button
                    key={curr}
                    type="button"
                    onClick={() => setCurrency(curr)}
                    className={`px-4 py-2 rounded-lg border ${
                      currency === curr 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {curr}
                  </motion.button>
                ))}
              </div>

              {/* Amount Input with ETH Conversion */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-gray-700 text-lg font-semibold mb-3">
                    Amount
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      placeholder={`Enter amount in ${currency}`}
                      required
                      min="0"
                      step="0.01"
                    />
                    <div className="text-gray-600 text-sm">
                      {loadingRate ? (
                        <span className="animate-pulse">Loading rate...</span>
                      ) : (
                        ethRate && (
                          <div className="bg-gray-100 p-3 rounded-lg">
                            <p className="font-mono">≈ {ethAmount} ETH</p>
                            <p className="text-xs text-gray-500">1 ETH = {ethRate} {currency}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Keep existing suggested amounts section */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {suggestedAmounts.map((suggestedAmount) => (
                  <motion.button
                    key={suggestedAmount}
                    type="button"
                    onClick={() => setAmount(suggestedAmount.toString())}
                    className={`p-3 rounded-lg border ${
                      amount === suggestedAmount.toString()
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ${suggestedAmount}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Message */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block text-gray-700 text-lg font-semibold mb-3">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                rows="4"
                placeholder="Add a message of support..."
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              onClick={handleDonation}
              disabled={processing}
              className={`w-full ${
                processing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white py-4 rounded-lg text-lg font-semibold transition-colors duration-300`}
              whileHover={{ scale: processing ? 1 : 1.02 }}
              whileTap={{ scale: processing ? 1 : 0.98 }}
            >
              {processing ? 'Processing...' : 'Complete Donation'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default DonationForm; 
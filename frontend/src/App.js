import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DonationForm from './pages/DonationForm';
import TransactionHistory from './pages/TransactionHistory';
import Contact from './pages/Contact';
import MedicalAid from './pages/categories/MedicalAid';
import Education from './pages/categories/Education';
import Environment from './pages/categories/Environment';
import FoodAid from './pages/categories/FoodAid';
import AnimalWelfare from './pages/categories/AnimalWelfare';
import OrphanageSupport from './pages/categories/OrphanageSupport';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/donate"
            element={
              <ProtectedRoute>
                <DonationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionHistory />
              </ProtectedRoute>
            }
          />
          <Route path="/categories/medical-aid" element={<MedicalAid />} />
          <Route path="/categories/education" element={<Education />} />
          <Route path="/categories/environment" element={<Environment />} />
          <Route path="/categories/food-aid" element={<FoodAid />} />
          <Route path="/categories/animal-welfare" element={<AnimalWelfare />} />
          <Route path="/categories/orphanage-support" element={<OrphanageSupport />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

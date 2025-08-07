import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import NavbarRouter from './components/NavbarRouter';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRouter from './components/DashboardRouter';
import LandingPage from './pages/LandingPage';
import WriterLandingPage from './pages/WriterLandingPage';
import WriterApplication from './pages/WriterApplication';
import WriterApplicationSuccess from './pages/WriterApplicationSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import PlaceOrder from './pages/PlaceOrder';
import OrderSuccess from './pages/OrderSuccess';
import Payment from './pages/Payment';
import ClientDashboard from './pages/ClientDashboard';
import WriterDashboard from './pages/WriterDashboard';
import OrderDetails from './pages/OrderDetails';
import ManagerDashboard from './pages/ManagerDashboard';
import SupportDashboard from './pages/SupportDashboard';
import AccountantDashboard from './pages/AccountantDashboard';
import TechDashboard from './pages/TechDashboard';
import Testimonials from './pages/Testimonials';
import AboutUs from './pages/AboutUs';
import Guarantees from './pages/Guarantees';
import EssayWriting from './pages/services/EssayWriting';
import ResearchPapers from './pages/services/ResearchPapers';
import Dissertations from './pages/services/Dissertations';
import HomeworkHelp from './pages/services/HomeworkHelp';
import AllServices from './pages/AllServices';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/writers') || 
                          location.pathname.startsWith('/admin') || 
                          location.pathname.startsWith('/client/dashboard') ||
                          location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-white text-gray-800 font-poppins">
      <NavbarRouter />
      <main className={isDashboardRoute ? '' : 'container mx-auto p-4'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/writer-landing" element={<WriterLandingPage />} />
          <Route path="/writer-register" element={<WriterApplication />} />
          <Route path="/writer-application" element={<WriterApplication />} />
          <Route path="/writer-application-success" element={<WriterApplicationSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/guarantees" element={<Guarantees />} />
          
          {/* Service Pages */}
          <Route path="/services" element={<AllServices />} />
          <Route path="/services/all" element={<AllServices />} />
          <Route path="/services/essay-writing" element={<EssayWriting />} />
          <Route path="/services/research-papers" element={<ResearchPapers />} />
          <Route path="/services/dissertations" element={<Dissertations />} />
          <Route path="/services/homework-help" element={<HomeworkHelp />} />
          
          {/* Writers Section */}
          <Route 
            path="/writers" 
            element={
              <ProtectedRoute roles={['writer']}>
                <WriterDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/writers/dashboard" 
            element={
              <ProtectedRoute roles={['writer']}>
                <WriterDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/writers/orders/:orderId" 
            element={
              <ProtectedRoute roles={['writer']}>
                <OrderDetails />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Section */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['manager', 'support', 'accountant', 'tech']}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Portal</h1>
                  <p className="text-gray-600">Please navigate to your specific dashboard using the navigation menu.</p>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Manager Dashboard */}
          <Route 
            path="/admin/manager" 
            element={
              <ProtectedRoute roles={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Support Dashboard */}
          <Route 
            path="/admin/support" 
            element={
              <ProtectedRoute roles={['support']}>
                <SupportDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Accountant Dashboard */}
          <Route 
            path="/admin/accountant" 
            element={
              <ProtectedRoute roles={['accountant']}>
                <AccountantDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Tech Dashboard */}
          <Route 
            path="/admin/tech" 
            element={
              <ProtectedRoute roles={['tech']}>
                <TechDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Generic Dashboard Route - Redirects based on role */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          
          {/* Client Dashboard - Specific route */}
          <Route 
            path="/client/dashboard" 
            element={
              <ProtectedRoute roles={['client']}>
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;

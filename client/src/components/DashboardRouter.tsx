import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRoleBasedDashboardRoute, UserRole } from '../utils/roleRedirects';

const DashboardRouter: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const dashboardRoute = getRoleBasedDashboardRoute(user.role as UserRole);
      navigate(dashboardRoute, { replace: true });
    } else if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  // Show loading while determining redirect
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy"></div>
      </div>
    );
  }

  // This component should redirect, so we don't need to render anything
  return null;
};

export default DashboardRouter;

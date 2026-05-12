import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireStaff?: boolean;
}

export function ProtectedRoute({ children, requireStaff = false }: ProtectedRouteProps) {
  const { user, isChef } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireStaff && !isChef) {
    // If they aren't a chef but trying to access staff areas, send them to profile
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}

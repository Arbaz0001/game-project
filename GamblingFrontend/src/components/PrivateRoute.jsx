import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsAuthenticated(true);
    }
    setLoading(false); // Finish checking
  }, []);

  if (loading) return null; // Or a loader/spinner

  return isAuthenticated ? children : <Navigate to="/login" />;
};
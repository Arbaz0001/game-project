import { jwtDecode } from 'jwt-decode'; // ✅ correct named import
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance"; // Axios with token interceptor

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      return Date.now() >= decoded.exp * 1000;
    } catch (e) {
      return true;
    }
  };

  // Get cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Remove a cookie (for logout)
  const removeCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Fetch the current user info using /me route
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/users/me");
      const fetchedUser = res.data.user;
      setUser(fetchedUser);
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(fetchedUser)); // persist user again
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Try auto-login on app load
  useEffect(() => {
  const initAuth = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("user");
      }

      if (token && !isTokenExpired(token)) {
        setAccessToken(token);
        setIsAuthenticated(true);
        await fetchUser();
      } else {
        const refreshToken = getCookie("refreshToken");
        if (refreshToken) {
          const newToken = await refreshAccessToken(refreshToken);
          if (newToken) {
            setAccessToken(newToken);
            setIsAuthenticated(true);
            await fetchUser();
          }
        }
      }
    } catch (err) {
      console.error("Auth init failed:", err);
    } finally {
      setLoading(false);
    }
  };

  initAuth();
}, []);



  // Login handler
  const login = async (credentials) => {
    const res = await axiosInstance.post("/api/v1/users/login", credentials);
    const { accessToken, refreshToken, user } = res.data.data;

    // Save tokens & user info
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    // Refresh token must be set by backend, or fallback to this:
    document.cookie = `refreshToken=${refreshToken}; path=/; SameSite=Strict`;

    setUser(user);
    setAccessToken(accessToken);
    setIsAuthenticated(true);
  };

  // Logout handler
  const logout = async () => {
    try {
      await axiosInstance.post("/api/v1/users/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    removeCookie("refreshToken");
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false)
  };

  // Refresh access token using refresh token
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to refresh token');

      const data = await response.json();
      const { accessToken } = data.data;

      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);

      return accessToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      return null;
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        login,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
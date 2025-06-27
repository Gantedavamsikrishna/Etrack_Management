// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(undefined);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const storedUser = localStorage.getItem('etrack-user');
//     if (storedUser && storedUser !== 'undefined') {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (err) {
//         console.error('Failed to parse stored user:', err);
//         setError('Invalid session data. Please log in again.');
//         localStorage.removeItem('etrack-user');
//       }
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email, password, role) => {
//     setIsLoading(true);
//     setError('');

//     try {
//       const response = await fetch('http://localhost:3000/admin/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           adminEmail: email,
//           adminPassword: password,
//           userRole: role,
//         }),
//       });

//       const data = await response.json();
//       console.log('Login API response:', data);

//       if (response.ok && data.token) {
//         const userData = {
//           adminEmail: email,
//           adminName: data.adminName,
//           role: data.userRole,
//           token: data.token,
//         };
//         setUser(userData);
//         localStorage.setItem('etrack-user', JSON.stringify(userData));
//         localStorage.setItem('etrack-token', data.token);
//         setIsLoading(false);
//         return {
//           success: true,
//           role: data.userRole,
//           name: data.adminName,
//           token: data.token,
//         };
//       } else {
//         setError(data.message || 'Invalid email, password, or role');
//         setIsLoading(false);
//         return { success: false };
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       setError('Network error during login');
//       setIsLoading(false);
//       return { success: false };
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('etrack-user');
//     localStorage.removeItem('etrack-token');
//     setError('');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Use named import instead of default

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("etrack-user");
    const storedToken = localStorage.getItem("etrack-token");

    if (storedUser && storedToken && storedUser !== "undefined") {
      try {
        const decodedToken = jwtDecode(storedToken); // Use jwtDecode
        // Check if token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser(JSON.parse(storedUser));
        } else {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("etrack-user");
          localStorage.removeItem("etrack-token");
        }
      } catch (err) {
        console.error("Failed to parse stored user or token:", err);
        setError("Invalid session data. Please log in again.");
        localStorage.removeItem("etrack-user");
        localStorage.removeItem("etrack-token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, role) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://etrack-backend.onrender.com/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adminEmail: email,
            adminPassword: password,
            userRole: role,
          }),
        }
      );

      const data = await response.json();
      console.log("Login API response:", data);

      if (response.ok && data.token) {
        const userData = {
          adminEmail: email,
          adminName: data.adminName,
          role: data.userRole,
          token: data.token,
        };
        setUser(userData);
        localStorage.setItem("etrack-user", JSON.stringify(userData));
        localStorage.setItem("etrack-token", data.token);
        setIsLoading(false);
        return {
          success: true,
          role: data.userRole,
          name: data.adminName,
          token: data.token,
        };
      } else {
        setError(data.message || "Invalid email, password, or role");
        setIsLoading(false);
        return { success: false };
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error during login");
      setIsLoading(false);
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("etrack-user");
    localStorage.removeItem("etrack-token");
    setError("");
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem("etrack-token");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, error, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

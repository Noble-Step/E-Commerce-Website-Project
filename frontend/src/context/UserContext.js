import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

// User Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("registeredUsers");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    } catch (err) {}
  }, [registeredUsers]);
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (payload) => {
    if (payload && payload.email && payload.password) {
      try {
        setLoading(true);
        setError(null);

        const user = registeredUsers.find((u) => u.email === payload.email);
        if (!user || user.password !== payload.password) {
          throw new Error("Invalid email or password");
        }

        const { password, ...safeUser } = user;

        const newToken = btoa(`${user.id}:${Date.now()}`);

        setUser(safeUser);
        setToken(newToken);
        return safeUser;
      } catch (err) {
        setError(err.message || "Login error");
        throw err;
      } finally {
        setLoading(false);
      }
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      if (registeredUsers.some((u) => u.email === userData.email)) {
        throw new Error("Email already exists");
      }

      const newUser = {
        ...userData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isAdmin: userData.email === "admin@noblestep.com",
      };

      setRegisteredUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err.message || "Registration error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const setRegisteredUsersSafe = (updater) => {
    setRegisteredUsers((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem("registeredUsers", JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

  const updateRegisteredUser = (userId, updates) => {
    setRegisteredUsersSafe((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );

    if (user && user.id === userId) {
      setUser((prev) => ({ ...prev, ...updates }));
    }
  };

  const toggleAdminForUser = (userId) => {
    if (user && user.id === userId) return false;
    let changed = false;
    setRegisteredUsersSafe((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          changed = true;
          return { ...u, isAdmin: !u.isAdmin };
        }
        return u;
      })
    );
    return changed;
  };

  const deleteRegisteredUser = (userId) => {
    if (user && user.id === userId) return false;
    setRegisteredUsersSafe((prev) => prev.filter((u) => u.id !== userId));
    if (user && user.id === userId) {
      logout();
    }
    return true;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        registeredUsers,
        updateRegisteredUser,
        toggleAdminForUser,
        deleteRegisteredUser,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// User Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

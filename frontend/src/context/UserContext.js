import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import API from "../services/api";

const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // ignore
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      // ignore
    }
  },
};

const normalizeRegisteredUser = (record = {}) => {
  const id = record.id || record._id || `reg-${Date.now()}`;
  const first = record.firstName || record.first_name || "";
  const last = record.lastName || record.last_name || "";
  const derivedName = record.name || `${first} ${last}`.trim() || "User";

  return {
    id: String(id),
    name: derivedName,
    email: record.email || "unknown@nobles.step",
    isAdmin: Boolean(record.isAdmin),
    createdAt: record.createdAt || new Date().toISOString(),
  };
};

const UserContext = createContext(null);

// User Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.get("user", null));
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const stored = storage.get("registeredUsers", null);
    if (Array.isArray(stored) && stored.length) {
      return stored.map((entry) => normalizeRegisteredUser(entry));
    }
    return [];
  });
  const [registryHydrated, setRegistryHydrated] = useState(false);

  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    if (user) {
      storage.set("user", user);
    } else {
      storage.remove("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    storage.set("registeredUsers", registeredUsers);
    if (!registryHydrated) {
      setRegistryHydrated(true);
    }
  }, [registeredUsers, registryHydrated]);

  const upsertRegisteredUser = useCallback((record) => {
    if (!record) return;
    const normalized = normalizeRegisteredUser(record);
    setRegisteredUsers((prev) => {
      const exists = prev.some(
        (entry) => String(entry.id) === String(normalized.id)
      );
      if (exists) {
        return prev.map((entry) =>
          String(entry.id) === String(normalized.id) ? normalized : entry
        );
      }
      return [normalized, ...prev];
    });
  }, []);

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.post(`/users/login`, { email, password });
      const data = response.data;
      const returnedUser = data.user || data;
      setUser(returnedUser);
      if (returnedUser.token) setToken(returnedUser.token);
      upsertRegisteredUser(returnedUser);
      return returnedUser;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.post(`/users/register`, userData);
      const data = response.data;
      const returnedUser = data.user || data;
      setUser(returnedUser);
      if (returnedUser.token) setToken(returnedUser.token);
      upsertRegisteredUser(returnedUser);
      return returnedUser;
    } catch (err) {
      // Extract validation errors if available
      const validationErrors = err.response?.data?.errors;
      let errorMessage =
        err.response?.data?.message || err.message || "Registration failed";

      // If there are validation errors, format them into a readable message
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        const errorMessages = validationErrors
          .map((e) => e.message || `${e.field}: ${e.message}`)
          .join(". ");
        errorMessage = errorMessages;
      }

      setError(errorMessage);
      // Attach the error message to the error object so RegisterModal can access it
      err.message = errorMessage;
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storage.remove("user");
    storage.remove("token");
  };

  const updateUser = async (updates) => {
    try {
      setLoading(true);
      const response = await API.put(`/users/profile`, updates);
      const data = response.data;
      const returnedUser = data.user || data;
      setUser(returnedUser);
      if (returnedUser.token) setToken(returnedUser.token);
      upsertRegisteredUser(returnedUser);
      return returnedUser;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Update failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRegisteredUser = (userId, updates) => {
    if (String(userId) === String(currentUserId)) {
      return false;
    }
    let updated = false;
    setRegisteredUsers((prev) =>
      prev.map((entry) => {
        if (String(entry.id) !== String(userId)) {
          return entry;
        }
        updated = true;
        const nextName = updates.name || entry.name;
        return {
          ...entry,
          name: nextName,
          email: updates.email || entry.email,
          isAdmin:
            typeof updates.isAdmin === "boolean"
              ? updates.isAdmin
              : entry.isAdmin,
        };
      })
    );
    return updated;
  };

  const toggleAdminForUser = (userId) => {
    if (String(userId) === String(currentUserId)) {
      return false;
    }
    let toggledUser = null;
    setRegisteredUsers((prev) =>
      prev.map((entry) => {
        if (String(entry.id) !== String(userId)) return entry;
        toggledUser = { ...entry, isAdmin: !entry.isAdmin };
        return toggledUser;
      })
    );
    return Boolean(toggledUser);
  };

  const deleteRegisteredUser = (userId) => {
    if (String(userId) === String(currentUserId)) {
      return false;
    }
    let deleted = false;
    setRegisteredUsers((prev) => {
      const next = prev.filter((entry) => {
        const shouldKeep = String(entry.id) !== String(userId);
        if (!shouldKeep) deleted = true;
        return shouldKeep;
      });
      return next;
    });
    return deleted;
  };

  const seedRegisteredUsers = useCallback(() => {
    setRegisteredUsers((prev) => (prev.length ? prev : []));
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        registeredUsers,
        registryHydrated,
        login,
        register,
        logout,
        updateUser,
        updateRegisteredUser,
        toggleAdminForUser,
        deleteRegisteredUser,
        seedRegisteredUsers,
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

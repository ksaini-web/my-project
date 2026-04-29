import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const USERS = [
  {
    id: 1,
    name: "Admin User",
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "Staff User",
    username: "staff",
    email: "staff@example.com",
    password: "staff123",
    role: "staff",
  },
];

const STORAGE_KEY = "voucher_app_auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = ({ email, password }) => {
    const loginId = email.trim().toLowerCase();
    const matchedUser = USERS.find(
      (item) =>
        (item.email.toLowerCase() === loginId ||
          item.username.toLowerCase() === loginId) &&
        item.password === password
    );

    if (!matchedUser) {
      throw new Error("Invalid email or password.");
    }

    const { password: _password, ...safeUser } = matchedUser;
    setUser(safeUser);
    return safeUser;
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

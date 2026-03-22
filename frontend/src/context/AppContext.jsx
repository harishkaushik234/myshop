import { createContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import api, { setAuthToken } from "../api/client";

export const AppContext = createContext(null);

const storedAuth = JSON.parse(localStorage.getItem("agro-auth") || "null");
const storedCart = JSON.parse(localStorage.getItem("agro-cart") || "[]");

if (storedAuth?.token) {
  setAuthToken(storedAuth.token);
}

export const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    storedAuth
      ? { ...storedAuth, isAuthenticated: Boolean(storedAuth.token && storedAuth.user) }
      : { token: "", user: null, isAuthenticated: false }
  );
  const [cart, setCart] = useState(storedCart);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [unreadChatByUser, setUnreadChatByUser] = useState({});
  const [newOrderNotifications, setNewOrderNotifications] = useState(0);

  useEffect(() => {
    localStorage.setItem("agro-auth", JSON.stringify(auth));
    setAuthToken(auth.token);
  }, [auth]);

  useEffect(() => {
    if (!auth.token) {
      setUnreadChatByUser({});
      setNewOrderNotifications(0);
      return;
    }

    const validateSession = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setAuth((current) => ({
          ...current,
          user: data.user,
          isAuthenticated: true
        }));
      } catch (error) {
        setAuth({ token: "", user: null, isAuthenticated: false });
        toast.error("Your session expired. Please login again.");
      }
    };

    validateSession();
  }, [auth.token]);

  useEffect(() => {
    if (!auth.token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const nextSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: { token: auth.token }
    });

    const handleIncomingChat = (incoming) => {
      const senderId = incoming.sender?._id || incoming.sender;
      if (!senderId || senderId === auth.user?._id) {
        return;
      }

      setUnreadChatByUser((current) => ({
        ...current,
        [senderId]: (current[senderId] || 0) + 1
      }));
      toast.success(`+1 message from ${incoming.sender?.name || "a contact"}`);
    };

    const handleIncomingOrder = (incoming) => {
      if (auth.user?.role !== "admin") {
        return;
      }

      setNewOrderNotifications((current) => current + 1);
      toast.success(`New order from ${incoming.user?.name || "a client"}`);
    };

    nextSocket.on("chat:new", handleIncomingChat);
    nextSocket.on("order:new", handleIncomingOrder);
    setSocket(nextSocket);

    return () => {
      nextSocket.off("chat:new", handleIncomingChat);
      nextSocket.off("order:new", handleIncomingOrder);
      nextSocket.disconnect();
      setSocket(null);
    };
  }, [auth.token, auth.user?._id, auth.user?.role]);

  useEffect(() => {
    if (!auth.token) {
      return;
    }

    const hydrateUnreadChats = async () => {
      try {
        const { data } = await api.get("/chat/contacts");
        setUnreadChatByUser(
          data.reduce((accumulator, contact) => {
            if (contact.unreadCount) {
              accumulator[contact._id] = contact.unreadCount;
            }

            return accumulator;
          }, {})
        );
      } catch (error) {}
    };

    hydrateUnreadChats();
  }, [auth.token]);

  useEffect(() => {
    localStorage.setItem("agro-cart", JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async (params = {}) => {
    const { data } = await api.get("/products", { params });
    setProducts(data);
    return data;
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      setAuth({ ...data, isAuthenticated: true });
      toast.success("Account created");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", payload);
      setAuth({ ...data, isAuthenticated: true });
      toast.success("Welcome back");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuth({ token: "", user: null, isAuthenticated: false });
    setCart([]);
    toast.success("Logged out");
  };

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item._id === product._id);
      if (existing) {
        return current.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
    toast.success("Added to cart");
  };

  const updateCartQuantity = (_id, quantity) => {
    if (quantity <= 0) {
      return setCart((current) => current.filter((item) => item._id !== _id));
    }

    setCart((current) =>
      current.map((item) => (item._id === _id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const clearChatNotificationsForUser = (userId) => {
    if (!userId) {
      return;
    }

    setUnreadChatByUser((current) => {
      if (!current[userId]) {
        return current;
      }

      const next = { ...current };
      delete next[userId];
      return next;
    });
  };

  const clearOrderNotifications = () => setNewOrderNotifications(0);

  const totalUnreadMessages = Object.values(unreadChatByUser).reduce(
    (sum, count) => sum + count,
    0
  );

  const value = useMemo(
    () => ({
      api,
      auth,
      cart,
      products,
      loading,
      register,
      login,
      logout,
      fetchProducts,
      addToCart,
      updateCartQuantity,
      clearCart,
      socket,
      unreadChatByUser,
      totalUnreadMessages,
      newOrderNotifications,
      clearChatNotificationsForUser,
      clearOrderNotifications,
      setProducts,
      setAuth
    }),
    [auth, cart, products, loading, socket, unreadChatByUser, totalUnreadMessages, newOrderNotifications]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

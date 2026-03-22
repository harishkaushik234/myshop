import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const AdminOrdersPage = () => {
  const { api, clearOrderNotifications } = useAppContext();
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      toast.error(t("loadOrdersError"));
    }
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    toast.success(t("orderStatusUpdated"));
    loadOrders();
  };

  useEffect(() => {
    clearOrderNotifications();
    loadOrders();
  }, []);

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="glass-panel p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold sm:text-lg">{order.user?.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {order.user?.email}
                <br />
                {new Date(order.createdAt).toLocaleString(language === "hi" ? "hi-IN" : "en-US")}
              </p>
            </div>
            <p className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              Rs. {order.totalAmount}
            </p>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {order.items.map((item) => (
              <p key={item.product}>{item.name} x {item.quantity}</p>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            {["pending", "processing", "completed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => updateStatus(order._id, status)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  order.status === status
                    ? "bg-slate-900 text-white dark:bg-brand-500"
                    : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrdersPage;

import { useEffect, useState } from "react";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const ClientOrdersPage = () => {
  const { api } = useAppContext();
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const response = await api.get("/orders/mine");
      setOrders(response.data);
    };

    loadOrders();
  }, [api]);

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="glass-panel p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{t("order")} #{order._id.slice(-6)}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {new Date(order.createdAt).toLocaleString(language === "hi" ? "hi-IN" : "en-US")}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-brand-700">Rs. {order.totalAmount}</p>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">{order.status}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {order.items.map((item) => (
              <p key={item.product}>{item.name} x {item.quantity}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientOrdersPage;

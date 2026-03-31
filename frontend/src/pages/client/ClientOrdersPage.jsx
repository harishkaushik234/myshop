import { useEffect, useState } from "react";
import { PackageSearch } from "lucide-react";
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
      {orders.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center gap-4 p-8 text-center sm:p-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <PackageSearch size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t("noOrdersYet")}</h3>
            <p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">{t("noOrdersYetText")}</p>
          </div>
        </div>
      ) : null}

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

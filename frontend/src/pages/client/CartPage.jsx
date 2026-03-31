import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const CartPage = () => {
  const { api, cart, updateCartQuantity, clearCart } = useAppContext();
  const { t } = useLanguage();
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    await api.post("/orders", {
      items: cart.map((item) => ({ productId: item._id, quantity: item.quantity })),
      shippingAddress,
      notes
    });

    toast.success(t("placeOrder"));
    clearCart();
    setShippingAddress("");
    setNotes("");
  };

  return (
    <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1fr_360px]">
      <div className="glass-panel p-4 sm:p-6">
        <h2 className="section-title">{t("yourCart")}</h2>
        <div className="mt-4 space-y-4">
          {!cart.length ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              Your cart is empty. Add products from the shop to continue.
            </div>
          ) : null}
          {cart.map((item) => (
            <div key={item._id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-slate-900 dark:text-slate-100">{item.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">Rs. {item.price}</p>
              </div>
              <input
                type="number"
                min="0"
                value={item.quantity}
                onChange={(event) => updateCartQuantity(item._id, Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-24"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel space-y-4 p-4 sm:p-6 xl:sticky xl:top-28 xl:self-start">
        <h2 className="section-title">{t("checkout")}</h2>
        <textarea
          value={shippingAddress}
          onChange={(event) => setShippingAddress(event.target.value)}
          placeholder={t("enterDeliveryAddress")}
          className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder={t("orderNotes")}
          className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{t("total")}: Rs. {total}</p>
        <button
          onClick={placeOrder}
          disabled={!cart.length || !shippingAddress}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white disabled:opacity-60"
        >
          {t("placeOrder")}
        </button>
      </div>
    </div>
  );
};

export default CartPage;

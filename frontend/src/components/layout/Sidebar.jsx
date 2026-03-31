import { Award, BarChart3, Bot, MessageSquareText, Package, ShoppingCart, Sparkles, Star, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";
import ShopLogo from "../shared/ShopLogo";

const Sidebar = ({ mobileOpen = false, onClose }) => {
  const location = useLocation();
  const { auth, totalUnreadMessages, newOrderNotifications, clearOrderNotifications } = useAppContext();
  const { t } = useLanguage();
  const adminLinks = [
    { to: "/dashboard", label: t("overview"), icon: BarChart3 },
    { to: "/dashboard/products", label: t("products"), icon: Package },
    { to: "/dashboard/orders", label: t("orders"), icon: ShoppingCart },
    { to: "/dashboard/chat", label: t("chat"), icon: MessageSquareText },
    { to: "/dashboard/scans", label: t("cropUploads"), icon: Bot },
    { to: "/dashboard/certificates", label: t("certificates"), icon: Award },
    { to: "/dashboard/feedback", label: t("feedback"), icon: Star }
  ];

  const clientLinks = [
    { to: "/dashboard/products", label: t("shop"), icon: Package },
    { to: "/dashboard", label: t("overview"), icon: Sparkles },
    { to: "/dashboard/cart", label: t("cart"), icon: ShoppingCart },
    { to: "/dashboard/orders", label: t("orders"), icon: BarChart3 },
    { to: "/dashboard/chat", label: t("chat"), icon: MessageSquareText },
    { to: "/dashboard/ai", label: t("aiUpload"), icon: Bot },
    { to: "/dashboard/certificates", label: t("certificates"), icon: Award },
    { to: "/dashboard/feedback", label: t("feedbackContact"), icon: Star }
  ];
  const links = auth.user?.role === "admin" ? adminLinks : clientLinks;

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm transition lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[88vw] max-w-80 flex-col gap-5 border-r border-slate-800 bg-slate-950 px-3 py-4 text-white transition-transform duration-300 lg:static lg:w-72 lg:translate-x-0 lg:gap-6 lg:px-4 lg:py-6 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between lg:hidden">
          <ShopLogo compact light />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-brand-700 via-brand-500 to-sun p-4 text-slate-950 lg:p-5">
          <ShopLogo compact light />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em]">{t("smartAgriculture")}</p>
          <h2 className="mt-2 text-lg font-bold leading-tight sm:text-2xl">{t("cropCareLine")}</h2>
        </div>

        <nav className="space-y-2 overflow-y-auto pr-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => {
                  if (link.to === "/dashboard/orders") {
                    clearOrderNotifications();
                  }
                  onClose?.();
                }}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon size={18} />
                <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <span className="truncate">{link.label}</span>
                  {link.to === "/dashboard/chat" && totalUnreadMessages ? (
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      +{totalUnreadMessages}
                    </span>
                  ) : null}
                  {auth.user?.role === "admin" && link.to === "/dashboard/orders" && newOrderNotifications ? (
                    <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      +{newOrderNotifications}
                    </span>
                  ) : null}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

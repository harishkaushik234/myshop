import { Bell, LogOut, Menu, MessageSquareText, Moon, ShieldCheck, ShoppingBag, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";
import { useTheme } from "../../hooks/useTheme";
import ShopLogo from "../shared/ShopLogo";

const Navbar = ({ onOpenSidebar }) => {
  const {
    auth,
    logout,
    totalUnreadMessages,
    newOrderNotifications,
    clearOrderNotifications
  } = useAppContext();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const openChat = () => navigate("/dashboard/chat");
  const openOrders = () => {
    clearOrderNotifications();
    navigate("/dashboard/orders");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-3 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:px-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 lg:hidden"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <ShopLogo />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openChat}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
          >
            <MessageSquareText size={18} />
            {totalUnreadMessages ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                +{totalUnreadMessages}
              </span>
            ) : null}
          </button>
          {auth.user?.role === "admin" ? (
            <button
              type="button"
              onClick={openOrders}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
            >
              <ShoppingBag size={18} />
              {newOrderNotifications ? (
                <span className="absolute -right-1 -top-1 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  +{newOrderNotifications}
                </span>
              ) : null}
            </button>
          ) : null}
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span className="hidden sm:inline">{theme === "dark" ? t("light") : t("dark")}</span>
          </button>
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800 sm:flex">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              {t("language")}
            </span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="bg-transparent text-sm font-medium text-slate-900 outline-none dark:text-slate-100"
            >
              <option value="en">{t("english")}</option>
              <option value="hi">{t("hindi")}</option>
            </select>
          </div>
          <div className="hidden rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-100 sm:flex sm:items-center sm:gap-2">
            <ShieldCheck size={16} />
            {auth.user?.rewardPoints || 0} {t("rewardPoints")}
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 sm:px-4"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">{t("logout")}</span>
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 lg:mt-2">
        <h1 className="min-w-0 text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
          {auth.user?.role === "admin" ? t("shopkeeperDashboard") : t("farmerDashboard")}
        </h1>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:hidden">
          <div className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100">
            <span className="inline-flex items-center gap-1">
              <Bell size={12} />
              {totalUnreadMessages + (auth.user?.role === "admin" ? newOrderNotifications : 0)}
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              {t("language")}
            </span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="max-w-20 bg-transparent text-sm font-medium text-slate-900 outline-none dark:text-slate-100"
            >
              <option value="en">{t("english")}</option>
              <option value="hi">{t("hindi")}</option>
            </select>
          </div>
          <div className="rounded-full bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-100">
            {auth.user?.rewardPoints || 0}
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-800 lg:hidden">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
            {t("language")}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

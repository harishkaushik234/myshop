import { ChevronRight, Leaf, LockKeyhole, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";
import ShopLogo from "../../components/shared/ShopLogo";

const LoginPage = () => {
  const { login, loading } = useAppContext();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const highlightCards = [
    {
      icon: Leaf,
      title: "Smart crop guidance",
      text: "Upload field images, track disease scans, and keep records in one place."
    },
    {
      icon: MessageSquareText,
      title: "Direct shop support",
      text: "Stay connected with the shopkeeper through built-in real-time chat."
    },
    {
      icon: Sparkles,
      title: "Rewards for farmers",
      text: "Earn points from orders and crop uploads while growing your profile."
    }
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await login(form);
      navigate(data.user.role === "client" ? "/dashboard/products" : "/dashboard", {
        replace: true
      });
    } catch (error) {}
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.25),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.2),transparent_22%),linear-gradient(180deg,#f8fafc_0%,#ecfdf5_48%,#eff6ff_100%)] px-4 py-8 dark:bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#081224_45%,#0f172a_100%)] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[8%] top-20 h-44 w-44 rounded-full bg-amber-300/30 blur-3xl dark:bg-amber-400/10" />
        <div className="absolute bottom-16 right-[10%] h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/10" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950/80 p-6 shadow-panel backdrop-blur sm:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <ShopLogo />
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200 sm:flex">
              <ShieldCheck size={16} />
              Secure farmer login
            </div>
          </div>

          <div className="mt-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-300">
              {t("smartAgriculture")}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              {t("heroText")}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {highlightCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-100">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{card.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-panel backdrop-blur sm:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">
                {t("welcomeBack")}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">{t("loginToAccount")}</h2>
            </div>
            <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 text-white shadow-lg shadow-brand-500/25 sm:flex">
              <LockKeyhole size={22} />
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <p className="text-sm font-medium text-emerald-100">
              Secure access for farmers and shopkeeper dashboard management.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">{t("email")}</label>
              <input
                type="email"
                placeholder={t("email")}
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-4 text-slate-100 outline-none ring-brand-500 transition placeholder:text-slate-500 focus:border-brand-400 focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">{t("password")}</label>
              <input
                type="password"
                placeholder={t("password")}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-4 text-slate-100 outline-none ring-brand-500 transition placeholder:text-slate-500 focus:border-brand-400 focus:ring-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-4 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:opacity-70"
            >
              {loading ? t("signingIn") : t("login")}
              {!loading ? <ChevronRight size={18} /> : null}
            </button>
          </form>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-slate-100">AI crop support</p>
              <p className="mt-1 text-sm text-slate-300">
                Disease scan history, product suggestions, and support tracking.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-slate-100">Fast order workflow</p>
              <p className="mt-1 text-sm text-slate-300">
                Browse products, place orders, and collect reward points from one dashboard.
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-300">
            {t("noAccount")}{" "}
            <Link to="/register" className="font-semibold text-brand-300">
              {t("registerHere")}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;

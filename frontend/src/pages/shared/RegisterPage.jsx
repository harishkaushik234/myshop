import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";
import ShopLogo from "../../components/shared/ShopLogo";

const RegisterPage = () => {
  const { register, loading } = useAppContext();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
    adminInviteCode: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await register(form);
      navigate(data.user.role === "client" ? "/dashboard/products" : "/dashboard", {
        replace: true
      });
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-hero px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-5 shadow-panel dark:bg-slate-900 sm:p-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:p-10">
        <div className="mb-8 lg:mb-0">
          <ShopLogo />
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">{t("createAccount")}</p>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">{t("joinApp")}</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Create your account to browse products, place orders, upload crop scans, and stay connected with the shopkeeper.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Farmer-first access</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Manage orders, feedback, scans, and rewards from one mobile-friendly dashboard.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Simple shop onboarding</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Register quickly and switch to admin mode with the invite code when needed.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder={t("fullName")}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:col-span-2"
            required
          />
          <input
            type="email"
            placeholder={t("email")}
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:col-span-2"
            required
          />
          <input
            type="password"
            placeholder={t("password")}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:col-span-2"
            required
          />
          <select
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:col-span-2"
          >
            <option value="client">{t("clientFarmer")}</option>
            <option value="admin">{t("adminShopkeeper")}</option>
          </select>
          {form.role === "admin" ? (
            <input
              type="text"
              placeholder={t("adminInviteCode")}
              value={form.adminInviteCode}
              onChange={(event) => setForm({ ...form, adminInviteCode: event.target.value })}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:col-span-2"
              required
            />
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-brand-700 disabled:opacity-70 sm:col-span-2"
          >
            {loading ? t("creating") : t("createAccount")}
          </button>
          <p className="text-sm text-slate-600 dark:text-slate-300 sm:col-span-2">
            {t("alreadyAccount")}{" "}
            <Link to="/login" className="font-semibold text-brand-700">
              {t("login")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

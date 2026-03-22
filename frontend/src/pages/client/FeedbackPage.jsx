import { Mail, MapPin, MessageSquareText, Phone, Star } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const FeedbackPage = () => {
  const { api, auth } = useAppContext();
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [publicFeedback, setPublicFeedback] = useState([]);
  const [shopInfo, setShopInfo] = useState(null);
  const [form, setForm] = useState({
    type: "feedback",
    name: auth.user?.name || "",
    email: auth.user?.email || "",
    phone: "",
    subject: "",
    rating: 5,
    message: ""
  });

  const loadItems = async () => {
    const [mineResponse, publicResponse, infoResponse] = await Promise.all([
      api.get("/feedback/mine"),
      api.get("/feedback/public"),
      api.get("/dashboard/shop-info")
    ]);

    setItems(mineResponse.data);
    setPublicFeedback(publicResponse.data);
    setShopInfo(infoResponse.data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/feedback", form);
    toast.success(form.type === "contact" ? t("messageSent") : t("feedbackSubmitted"));
    setForm({
      type: "feedback",
      name: auth.user?.name || "",
      email: auth.user?.email || "",
      phone: "",
      subject: "",
      rating: 5,
      message: ""
    });
    loadItems();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel space-y-5 p-4 sm:p-6">
          <div>
            <h2 className="section-title">{t("contactInformation")}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("contactInformationText")}</p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/70">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
                  <Phone size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{t("phoneNumber")}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-slate-100">{shopInfo?.phone || "-"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/70">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{t("emailAddress")}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-slate-100">{shopInfo?.email || "-"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/70">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{t("shopLocation")}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-slate-100">{shopInfo?.address || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="glass-panel space-y-4 p-4 sm:p-6">
          <div>
            <h2 className="section-title">{t("feedbackContactTitle")}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("feedbackContactSubtitle")}</p>
          </div>

          <select
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="feedback">{t("feedback")}</option>
            <option value="contact">{t("contactUs")}</option>
          </select>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder={t("yourName")}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder={t("yourEmail")}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            placeholder={t("phoneNumberPlaceholder")}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            value={form.subject}
            onChange={(event) => setForm({ ...form, subject: event.target.value })}
            placeholder={t("subjectPlaceholder")}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          {form.type === "feedback" ? (
            <select
              value={form.rating}
              onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {t("ratingLabel")} {rating}/5
                </option>
              ))}
            </select>
          ) : null}
          <textarea
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            placeholder={t("messagePlaceholder")}
            className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white dark:bg-brand-500">
            {form.type === "contact" ? t("sendMessage") : t("submitFeedback")}
          </button>
        </form>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel p-4 sm:p-6">
          <h2 className="section-title">{t("publicReviews")}</h2>
          <div className="mt-4 space-y-4">
            {publicFeedback.length ? (
              publicFeedback.map((item) => (
                <div key={item._id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.subject || t("generalFeedback")}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                      <Star size={14} fill="currentColor" />
                      {item.rating}/5
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.message}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {t("noPublicReviews")}
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
              <MessageSquareText size={18} />
            </div>
            <h2 className="section-title">{t("yourMessagesRatings")}</h2>
          </div>
          <div className="mt-4 space-y-4">
            {items.length ? (
              items.map((item) => (
                <div key={item._id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.subject || t("generalMessage")}
                      </h3>
                    </div>
                    {item.type === "feedback" ? <p className="text-sm font-semibold text-brand-700">{item.rating}/5</p> : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.message}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
                    {item.status === "reviewed" ? t("reviewed") : t("newStatus")}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {t("noMessagesYet")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;

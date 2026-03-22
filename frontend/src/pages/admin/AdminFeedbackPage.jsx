import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const AdminFeedbackPage = () => {
  const { api } = useAppContext();
  const { t } = useLanguage();
  const [items, setItems] = useState([]);

  const loadItems = async () => {
    const response = await api.get("/feedback");
    setItems(response.data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const markReviewed = async (id) => {
    await api.patch(`/feedback/${id}/status`, { status: "reviewed" });
    toast.success(t("reviewed"));
    loadItems();
  };

  return (
    <div className="space-y-4">
      <div className="glass-panel p-4 sm:p-6">
        <h2 className="section-title">{t("feedbackContact")}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {t("publicReviews")} and client contact messages appear here for review.
        </p>
      </div>

      {items.map((item) => (
        <div key={item._id} className="glass-panel p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">{item.subject || item.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">{item.name} • {item.email}</p>
              {item.phone ? <p className="text-sm text-slate-500 dark:text-slate-300">{item.phone}</p> : null}
            </div>
            <div className="sm:text-right">
              {item.type === "feedback" ? (
                <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                  <Star size={14} fill="currentColor" />
                  {item.rating}/5
                </div>
              ) : null}
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
                {item.status}
              </p>
            </div>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{item.message}</p>
          {item.status !== "reviewed" ? (
            <button
              onClick={() => markReviewed(item._id)}
              className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              {t("reviewed")}
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default AdminFeedbackPage;

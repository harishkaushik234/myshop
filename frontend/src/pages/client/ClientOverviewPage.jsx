import { useEffect, useMemo, useState } from "react";
import StatsCard from "../../components/shared/StatsCard";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const ClientOverviewPage = () => {
  const { api, auth } = useAppContext();
  const { t } = useLanguage();
  const [summary, setSummary] = useState(null);
  const uniqueBadges = useMemo(
    () =>
      (summary?.badges || []).filter((badge, index, badges) => {
        const firstMatch = badges.findIndex(
          (entry) => entry.title === badge.title && entry.description === badge.description
        );

        return firstMatch === index;
      }),
    [summary?.badges]
  );

  useEffect(() => {
    const loadSummary = async () => {
      const response = await api.get("/dashboard/client");
      setSummary(response.data);
    };

    loadSummary();
  }, [api]);

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-700">{t("welcome")}</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{auth.user?.name}</h2>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{t("overviewText")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard label={t("rewardPoints")} value={summary.rewardPoints} accent="bg-brand-500" />
        <StatsCard label={t("recentOrders")} value={summary.orders.length} accent="bg-sun" />
        <StatsCard label={t("recentScans")} value={summary.scans.length} accent="bg-sky-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel p-6">
          <h3 className="section-title">{t("badges")}</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {uniqueBadges.length ? (
              uniqueBadges.map((badge, index) => (
                <div
                  key={`${badge.title}-${badge.description}-${index}`}
                  className="rounded-2xl border border-brand-100 bg-brand-50/80 px-4 py-3 dark:border-brand-500/20 dark:bg-slate-800"
                >
                  <p className="font-semibold text-brand-700 dark:text-brand-200">{badge.title}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{badge.description}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">{t("unlockBadges")}</p>
            )}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="section-title">{t("rewardHistory")}</h3>
          <div className="mt-4 space-y-3">
            {summary.rewardHistory.map((reward) => (
              <div key={reward._id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="font-medium text-slate-900 dark:text-slate-100">{reward.description}</p>
                <p className="mt-1 text-sm font-medium text-brand-700 dark:text-brand-200">+{reward.points} points</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOverviewPage;

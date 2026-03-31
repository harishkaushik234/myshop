import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/shared/Loader";
import StatsCard from "../../components/shared/StatsCard";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const defaultBonusForm = {
  userId: "",
  points: 10,
  description: "Bonus reward from shopkeeper"
};

const AdminOverviewPage = () => {
  const { api } = useAppContext();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [rewardedUserIds, setRewardedUserIds] = useState([]);
  const [bonusForm, setBonusForm] = useState(defaultBonusForm);

  const getEligibleUsers = (list, hiddenIds = []) =>
    list.filter((user) => !hiddenIds.includes(user._id));

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analyticsResponse, usersResponse] = await Promise.all([
          api.get("/dashboard/admin"),
          api.get("/dashboard/users")
        ]);
        setData(analyticsResponse.data);
        setUsers(usersResponse.data);
        const eligibleUsers = getEligibleUsers(usersResponse.data, rewardedUserIds);
        setBonusForm((current) => ({
          ...current,
          userId: eligibleUsers[0]?._id || ""
        }));
      } catch (error) {
        toast.error(t("loadAdminDataError"));
      }
    };

    loadData();
  }, [api, rewardedUserIds, t]);

  const grantBonus = async (event) => {
    event.preventDefault();
    const rewardedUserId = bonusForm.userId;

    await api.post(`/dashboard/rewards/${bonusForm.userId}`, {
      points: bonusForm.points,
      description: bonusForm.description
    });

    toast.success(t("bonusGranted"));
    setRewardedUserIds((current) => [...new Set([...current, rewardedUserId])]);

    const [analyticsResponse, usersResponse] = await Promise.all([
      api.get("/dashboard/admin"),
      api.get("/dashboard/users")
    ]);

    const nextEligibleUsers = getEligibleUsers(usersResponse.data, [...rewardedUserIds, rewardedUserId]);
    setData(analyticsResponse.data);
    setUsers(usersResponse.data);
    setBonusForm({
      ...defaultBonusForm,
      userId: nextEligibleUsers[0]?._id || ""
    });
  };

  if (!data) {
    return <Loader label={t("loadingAnalytics")} />;
  }

  const eligibleUsers = getEligibleUsers(users, rewardedUserIds);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label={t("totalClients")} value={data.totalUsers} accent="bg-brand-500" />
        <StatsCard label={t("products")} value={data.totalProducts} accent="bg-sun" />
        <StatsCard label={t("orders")} value={data.totalOrders} accent="bg-sky-500" />
        <StatsCard label={t("sales")} value={`Rs. ${data.totalSales}`} accent="bg-emerald-500" />
      </div>

      <div className="glass-panel p-4 sm:p-6">
        <h2 className="section-title">{t("recentRewardActivity")}</h2>
        <div className="mt-4 space-y-3">
          {data.recentRewards.map((reward) => (
            <div key={reward._id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="font-medium text-slate-900 dark:text-slate-100">{reward.user?.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{reward.description}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                +{reward.points} points
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel p-4 sm:p-6">
          <h2 className="section-title">{t("clientRewardBoard")}</h2>
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div key={user._id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{user.email}</p>
                </div>
                <p className="self-start rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
                  {user.rewardPoints} pts
                </p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={grantBonus} className="glass-panel space-y-4 p-4 sm:p-6">
          <h2 className="section-title">{t("grantBonusReward")}</h2>
          <select
            value={bonusForm.userId}
            onChange={(event) => setBonusForm({ ...bonusForm, userId: event.target.value })}
            className="app-select w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            disabled={!eligibleUsers.length}
          >
            {eligibleUsers.length ? (
              eligibleUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))
            ) : (
              <option value="">{t("allClientsRewarded")}</option>
            )}
          </select>
          <input
            type="number"
            min="1"
            value={bonusForm.points}
            onChange={(event) => setBonusForm({ ...bonusForm, points: Number(event.target.value) })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            disabled={!eligibleUsers.length}
          />
          <textarea
            value={bonusForm.description}
            onChange={(event) => setBonusForm({ ...bonusForm, description: event.target.value })}
            className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            disabled={!eligibleUsers.length}
          />
          <button
            disabled={!eligibleUsers.length}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("grantBonus")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminOverviewPage;

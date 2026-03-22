import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const AdminScansPage = () => {
  const { api } = useAppContext();
  const { t } = useLanguage();
  const [scans, setScans] = useState([]);

  useEffect(() => {
    const loadScans = async () => {
      try {
        const response = await api.get("/ai");
        setScans(response.data);
      } catch (error) {
        toast.error(t("loadAdminScansError"));
      }
    };

    loadScans();
  }, [api]);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {scans.map((scan) => (
        <div key={scan._id} className="glass-panel overflow-hidden">
          <img src={scan.image} alt={scan.diseaseName} className="h-56 w-full object-cover" />
          <div className="space-y-3 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-300">{scan.user?.name}</p>
                <h3 className="text-xl font-semibold">{scan.diseaseName}</h3>
              </div>
              <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                {t("confidence")} {Math.round(scan.confidence * 100)}%
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{scan.description}</p>
            <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-100">{scan.treatment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminScansPage;

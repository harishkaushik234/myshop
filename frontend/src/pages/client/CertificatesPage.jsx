import { useEffect, useState } from "react";
import { CalendarDays, Expand } from "lucide-react";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";
import CertificateDetailsModal from "../../components/shared/CertificateDetailsModal";

const formatIssuedOn = (issuedOn) => {
  if (!issuedOn) {
    return null;
  }

  const date = new Date(issuedOn);

  if (Number.isNaN(date.getTime())) {
    return issuedOn;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
};

const CertificatesPage = () => {
  const { api } = useAppContext();
  const { t } = useLanguage();
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    const loadCertificates = async () => {
      const response = await api.get("/certificates");
      setCertificates(response.data);
    };

    loadCertificates();
  }, [api]);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-4 sm:p-6">
        <h2 className="section-title">{t("certificates")}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("certificatesSubtitle")}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {certificates.map((certificate) => (
          <button
            key={certificate._id}
            type="button"
            onClick={() => setSelectedCertificate(certificate)}
            className="glass-panel overflow-hidden text-left transition duration-200 hover:-translate-y-1 hover:border-emerald-300/50 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          >
            <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-emerald-50 p-3 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/40 sm:h-72 sm:p-5">
              <img
                src={certificate.image}
                alt={certificate.title}
                className="h-full w-full rounded-2xl border border-slate-200 bg-white object-contain shadow-sm dark:border-slate-700 dark:bg-slate-950"
              />
              <span className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white dark:bg-white/90 dark:text-slate-900">
                <Expand size={14} />
                {t("viewCertificate")}
              </span>
            </div>

            <div className="space-y-4 p-4 sm:p-5">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">{certificate.title}</h3>
                {certificate.issuer ? (
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-300">{certificate.issuer}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3">
                {certificate.issuedOn ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <CalendarDays size={14} />
                    {formatIssuedOn(certificate.issuedOn)}
                  </span>
                ) : null}
              </div>

              <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{certificate.description}</p>
            </div>
          </button>
        ))}
      </div>

      <CertificateDetailsModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
  );
};

export default CertificatesPage;

import { CalendarDays, ExternalLink, X } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

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
    month: "long",
    year: "numeric"
  }).format(date);
};

const CertificateDetailsModal = ({ certificate, onClose }) => {
  const { t } = useLanguage();

  if (!certificate) {
    return null;
  }

  const issuedOn = formatIssuedOn(certificate.issuedOn);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100"
          aria-label={t("close")}
        >
          <X size={18} />
        </button>

        <div className="grid max-h-[92vh] overflow-y-auto lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <div className="flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-emerald-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/40 sm:p-6">
            <div className="flex h-full min-h-[300px] w-full items-center justify-center overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-inner dark:border-slate-700 dark:bg-slate-950 sm:min-h-[420px] sm:p-5">
              <img
                src={certificate.image}
                alt={certificate.title}
                className="max-h-[72vh] w-full rounded-2xl object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 p-5 sm:p-7">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                {t("certificates")}
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                {certificate.title}
              </h3>
              {certificate.issuer ? (
                <p className="text-base font-medium text-slate-600 dark:text-slate-300">{certificate.issuer}</p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {issuedOn ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    {t("issuedOn")}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                    <CalendarDays size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span>{issuedOn}</span>
                  </div>
                </div>
              ) : null}

              <a
                href={certificate.image}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  {t("certificatePreview")}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <ExternalLink size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>{t("openFullImage")}</span>
                </div>
              </a>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                {t("description")}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base">
                {certificate.description || t("certificateDescriptionFallback")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetailsModal;

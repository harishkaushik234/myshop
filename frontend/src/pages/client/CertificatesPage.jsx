import { useEffect, useState } from "react";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const CertificatesPage = () => {
  const { api } = useAppContext();
  const { t } = useLanguage();
  const [certificates, setCertificates] = useState([]);

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
          <div key={certificate._id} className="glass-panel overflow-hidden">
            <img src={certificate.image} alt={certificate.title} className="h-48 w-full object-cover sm:h-60" />
            <div className="space-y-3 p-4 sm:p-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">{certificate.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">{certificate.issuer}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{certificate.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificatesPage;

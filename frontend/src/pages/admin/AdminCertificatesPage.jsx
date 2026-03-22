import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const AdminCertificatesPage = () => {
  const { api } = useAppContext();
  const { t } = useLanguage();
  const [certificates, setCertificates] = useState([]);
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    issuedOn: "",
    description: ""
  });
  const [image, setImage] = useState(null);

  const loadCertificates = async () => {
    const response = await api.get("/certificates");
    setCertificates(response.data);
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (image) {
      payload.append("image", image);
    }

    await api.post("/certificates", payload, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    toast.success(`${t("certificates")} added`);
    setForm({ title: "", issuer: "", issuedOn: "", description: "" });
    setImage(null);
    loadCertificates();
  };

  const removeCertificate = async (id) => {
    await api.delete(`/certificates/${id}`);
    toast.success(`${t("certificates")} deleted`);
    loadCertificates();
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-4 sm:p-6">
        <h2 className="section-title">{t("certificates")}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("certificatesSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel grid gap-4 p-4 sm:p-6 md:grid-cols-2">
        <input
          placeholder={`${t("certificates")} title`}
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          required
        />
        <input
          placeholder="Issuer / Authority"
          value={form.issuer}
          onChange={(event) => setForm({ ...form, issuer: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        <input
          type="date"
          value={form.issuedOn}
          onChange={(event) => setForm({ ...form, issuedOn: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files?.[0] || null)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          required
        />
        <textarea
          placeholder={`${t("certificates")} description`}
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 md:col-span-2"
        />
        <button className="rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white md:col-span-2">
          Add {t("certificates").toLowerCase()}
        </button>
      </form>

      <div className="grid gap-6 xl:grid-cols-2">
        {certificates.map((certificate) => (
          <div key={certificate._id} className="glass-panel overflow-hidden">
            <img src={certificate.image} alt={certificate.title} className="h-48 w-full object-cover sm:h-56" />
            <div className="space-y-3 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">{certificate.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{certificate.issuer}</p>
                </div>
                <button
                  onClick={() => removeCertificate(certificate._id)}
                  className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{certificate.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCertificatesPage;

import { useEffect, useState } from "react";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
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
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [editingCertificateId, setEditingCertificateId] = useState(null);

  const resetForm = () => {
    setForm({
      title: "",
      issuer: "",
      issuedOn: "",
      description: ""
    });
    setImage(null);
    setEditingCertificateId(null);
  };

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

    if (editingCertificateId) {
      await api.put(`/certificates/${editingCertificateId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success(`${t("certificates")} updated`);
    } else {
      await api.post("/certificates", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success(`${t("certificates")} added`);
    }

    resetForm();
    loadCertificates();
  };

  const removeCertificate = async (id) => {
    await api.delete(`/certificates/${id}`);
    toast.success(`${t("certificates")} deleted`);
    if (editingCertificateId === id) {
      resetForm();
    }
    loadCertificates();
  };

  const startEditing = (certificate) => {
    setEditingCertificateId(certificate._id);
    setForm({
      title: certificate.title || "",
      issuer: certificate.issuer || "",
      issuedOn: certificate.issuedOn ? String(certificate.issuedOn).slice(0, 10) : "",
      description: certificate.description || ""
    });
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-4 sm:p-6">
        <h2 className="section-title">{t("certificates")}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("certificatesSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel grid gap-4 p-4 sm:p-6 md:grid-cols-2">
        {editingCertificateId ? (
          <div className="md:col-span-2 rounded-2xl border border-emerald-300/40 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            Editing certificate details. Upload a new image only if you want to replace the current one.
          </div>
        ) : null}
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
          required={!editingCertificateId}
        />
        <textarea
          placeholder={`${t("certificates")} description`}
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 md:col-span-2"
        />
        <div className="grid gap-3 md:col-span-2 sm:grid-cols-2">
          <button className="rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white dark:bg-emerald-500 dark:text-slate-950">
            {editingCertificateId ? t("updateProduct") : `Add ${t("certificates").toLowerCase()}`}
          </button>
          {editingCertificateId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl border border-slate-300 px-4 py-3 font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              {t("cancelEdit")}
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-6 xl:grid-cols-2">
        {certificates.map((certificate) => (
          <div key={certificate._id} className="glass-panel overflow-hidden">
            <button
              type="button"
              onClick={() => setSelectedCertificate(certificate)}
              className="relative flex h-52 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-emerald-50 p-3 text-left transition hover:bg-emerald-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/40 dark:hover:bg-emerald-950/20 sm:h-60 sm:p-4"
            >
              <img
                src={certificate.image}
                alt={certificate.title}
                className="h-full w-full rounded-2xl border border-slate-200 bg-white object-contain shadow-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </button>
            <div className="space-y-3 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">{certificate.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{certificate.issuer}</p>
                  {certificate.issuedOn ? (
                    <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      <CalendarDays size={13} />
                      {formatIssuedOn(certificate.issuedOn)}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(certificate)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white"
                  >
                    <Pencil size={14} />
                    {t("editProduct")}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCertificate(certificate._id)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{certificate.description}</p>
            </div>
          </div>
        ))}
      </div>

      <CertificateDetailsModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
  );
};

export default AdminCertificatesPage;

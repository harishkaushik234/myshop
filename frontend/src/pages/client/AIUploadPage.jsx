import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const AIUploadPage = () => {
  const { api } = useAppContext();
  const { t } = useLanguage();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const isInconclusive = result?.diseaseName === "Inconclusive";

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setImage(file || null);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("image", image);
      const response = await api.post("/ai/scan", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(response.data);
      toast.success(t("scanCompleted"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 sm:gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={handleSubmit} className="glass-panel space-y-4 p-4 sm:p-6">
        <h2 className="section-title">{t("uploadCropImage")}</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        {preview ? (
          <div className="flex h-56 items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900 sm:h-72 sm:p-4">
            <img src={preview} alt="Preview" className="h-full w-full rounded-2xl object-contain" />
          </div>
        ) : (
          <div className="flex h-56 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 sm:h-72">
            {t("imagePreview")}
          </div>
        )}
        <button
          type="submit"
          disabled={!image || loading}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white disabled:opacity-60"
        >
          {loading ? t("analyzing") : t("detectDisease")}
        </button>
      </form>

      <div className="glass-panel p-4 sm:p-6">
        <h2 className="section-title">{t("aiResult")}</h2>
        {result ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-700">{result.cropType}</p>
            <h3 className={`text-2xl font-bold sm:text-3xl ${isInconclusive ? "text-amber-700" : "text-slate-900 dark:text-slate-100"}`}>
              {result.diseaseName}
            </h3>
            <p
              className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${
                isInconclusive
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                  : "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200"
              }`}
            >
              {t("confidence")}: {Math.round(result.confidence * 100)}%
            </p>
            <p className="text-slate-600 dark:text-slate-300">{result.description}</p>
            <div className={`rounded-3xl p-4 sm:p-5 ${isInconclusive ? "bg-slate-100 dark:bg-slate-800" : "bg-amber-50 dark:bg-amber-900/20"}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                {isInconclusive ? t("improveScan") : t("suggestedTreatment")}
              </p>
              <p className={`mt-2 ${isInconclusive ? "text-slate-700 dark:text-slate-200" : "text-amber-950 dark:text-amber-100"}`}>
                {result.treatment}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-slate-500 dark:bg-slate-800 dark:text-slate-300 sm:mt-8 sm:p-8">
            {t("uploadHint")}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIUploadPage;

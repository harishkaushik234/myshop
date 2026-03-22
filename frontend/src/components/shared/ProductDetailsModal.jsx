import { X } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const ProductDetailsModal = ({ product, onClose, onAddToCart }) => {
  const { t } = useLanguage();

  if (!product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/65 px-4 py-8">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl dark:bg-slate-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-700 shadow dark:bg-slate-800 dark:text-slate-100"
        >
          <X size={18} />
        </button>
        <div className="grid gap-0 lg:grid-cols-[1fr_1.05fr]">
          <div className="bg-gradient-to-br from-brand-50 via-white to-amber-50 p-5 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-inner dark:bg-slate-950">
              <img
                src={product.image || "https://placehold.co/900x700?text=Agro+Product"}
                alt={product.name}
                className="h-full min-h-[320px] w-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-5 p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase text-brand-700">
                  {product.category}
                </span>
                <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">{product.name}</h2>
              </div>
              <p className="rounded-full bg-slate-900 px-4 py-2 text-lg font-bold text-white">
                Rs. {product.price}
              </p>
            </div>

            <p className="leading-7 text-slate-600 dark:text-slate-300">{product.description}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
                  {t("category")}
                </p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{product.category}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
                  {t("availableStock")}
                </p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{product.stock}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-brand-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                {t("productTags")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.tags?.length ? (
                  product.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white px-3 py-1 text-sm text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-100">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500 dark:text-slate-300">{t("noTags")}</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                {t("recommendedFor")}
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-950">{t("productInfoText")}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onAddToCart(product)}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
              >
                {t("addToCart")}
              </button>
              <button
                onClick={onClose}
                className="rounded-full bg-slate-100 px-5 py-3 text-sm font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;

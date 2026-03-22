import { ShoppingCart } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const ProductCard = ({ product, onAddToCart, onViewDetails, showAdminMeta = false }) => {
  const { t } = useLanguage();

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-panel transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => onViewDetails?.(product)}
        className="block w-full text-left"
      >
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-100 via-white to-amber-100 sm:h-56">
          <img
            src={product.image || "https://placehold.co/600x400?text=Agro+Product"}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/60 to-transparent p-4">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase text-brand-700">
              {product.category}
            </span>
          </div>
        </div>
      </button>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">{product.name}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{t("stock")}: {product.stock}</p>
          </div>
          <p className="text-base font-bold text-brand-700 sm:text-lg">Rs. {product.price}</p>
        </div>

        <p className="min-h-[72px] overflow-hidden text-sm leading-6 text-slate-600 dark:text-slate-300">
          {product.description}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => onViewDetails?.(product)}
            className="w-full rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 sm:w-auto"
          >
            {t("viewDetails")}
          </button>
          {showAdminMeta ? (
            <span className="text-xs text-slate-500 dark:text-slate-300">{product.tags?.join(", ")}</span>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 sm:w-auto"
            >
              <ShoppingCart size={16} />
              {t("addToCart")}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

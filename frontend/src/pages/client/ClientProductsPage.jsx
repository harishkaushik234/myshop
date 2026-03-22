import { useEffect, useState } from "react";
import ProductDetailsModal from "../../components/shared/ProductDetailsModal";
import ProductCard from "../../components/shared/ProductCard";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const ClientProductsPage = () => {
  const { products, fetchProducts, addToCart } = useAppContext();
  const { t } = useLanguage();
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters.search, filters.category]);

  return (
    <div className="space-y-6">
      <div className="glass-panel grid gap-4 p-5 md:grid-cols-[1fr_220px]">
        <input
          value={filters.search}
          onChange={(event) => setFilters({ ...filters, search: event.target.value })}
          placeholder={t("searchProducts")}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        <select
          value={filters.category}
          onChange={(event) => setFilters({ ...filters, category: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          <option value="">{t("allCategories")}</option>
          <option value="pesticide">{t("pesticides")}</option>
          <option value="fertilizer">{t("fertilizers")}</option>
          <option value="supplement">{t("supplements")}</option>
          <option value="tool">{t("tools")}</option>
          <option value="seed">{t("seeds")}</option>
        </select>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={addToCart}
            onViewDetails={setSelectedProduct}
          />
        ))}
      </div>

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default ClientProductsPage;

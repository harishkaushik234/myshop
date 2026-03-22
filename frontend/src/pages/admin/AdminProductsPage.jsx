import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../components/shared/ProductCard";
import { useAppContext } from "../../hooks/useAppContext";
import { useLanguage } from "../../hooks/useLanguage";

const initialForm = {
  name: "",
  category: "pesticide",
  price: "",
  stock: "",
  description: "",
  tags: ""
};

const AdminProductsPage = () => {
  const { api, products, fetchProducts } = useAppContext();
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (image) {
      payload.append("image", image);
    }

    if (editingId) {
      await api.put(`/products/${editingId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success(t("productUpdated"));
    } else {
      await api.post("/products", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success(t("productAdded"));
    }

    setForm(initialForm);
    setImage(null);
    setEditingId("");
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    toast.success(t("productRemoved"));
    fetchProducts();
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      tags: product.tags?.join(", ") || ""
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="glass-panel grid gap-4 p-4 sm:p-6 md:grid-cols-2">
        <input
          placeholder={t("productName")}
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          required
        />
        <select
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          <option value="pesticide">{t("pesticides")}</option>
          <option value="fertilizer">{t("fertilizers")}</option>
          <option value="tool">{t("tools")}</option>
          <option value="seed">{t("seeds")}</option>
          <option value="supplement">{t("supplements")}</option>
        </select>
        <input
          placeholder={t("price")}
          type="number"
          value={form.price}
          onChange={(event) => setForm({ ...form, price: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          required
        />
        <input
          placeholder={t("stock")}
          type="number"
          value={form.stock}
          onChange={(event) => setForm({ ...form, stock: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          required
        />
        <input
          placeholder={t("tagsComma")}
          value={form.tags}
          onChange={(event) => setForm({ ...form, tags: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 md:col-span-2"
        />
        <textarea
          placeholder={t("description")}
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 md:col-span-2"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files?.[0] || null)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 md:col-span-2"
        />
        <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row">
          <button className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white">
            {editingId ? t("updateProduct") : t("addProduct")}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId("");
                setForm(initialForm);
                setImage(null);
              }}
              className="rounded-2xl bg-slate-200 px-4 py-3 font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100"
            >
              {t("cancelEdit")}
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-6 xl:grid-cols-2">
        {products.map((product) => (
          <div key={product._id} className="space-y-3">
            <ProductCard product={product} showAdminMeta />
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => startEdit(product)}
                className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white"
              >
                {t("editProduct")}
              </button>
              <button
                onClick={() => deleteProduct(product._id)}
                className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white"
              >
                {t("deleteProduct")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductsPage;

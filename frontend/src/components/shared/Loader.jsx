const Loader = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center gap-3 py-12 text-slate-600 dark:text-slate-300">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    <span>{label}</span>
  </div>
);

export default Loader;

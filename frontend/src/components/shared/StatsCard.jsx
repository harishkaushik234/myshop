const StatsCard = ({ label, value, accent = "bg-brand-500" }) => (
  <div className="glass-panel p-5">
    <div className={`h-2 w-20 rounded-full ${accent}`} />
    <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">{label}</p>
    <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</h3>
  </div>
);

export default StatsCard;

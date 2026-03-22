import shopLogo from "../../assets/Sunil Khad beej logo.png";

const ShopLogo = ({ compact = false, light = false }) => {
  if (compact) {
    return (
      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
        <img src={shopLogo} alt="SUNIL KHAD BEEJ BHANDER logo" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
        <img src={shopLogo} alt="SUNIL KHAD BEEJ BHANDER logo" className="h-full w-full object-cover" />
      </div>
      <div>
        <p
          className={`text-xs font-semibold uppercase tracking-[0.3em] ${
            light ? "text-white/80" : "text-brand-700"
          }`}
        >
          SKBB
        </p>
        <h2
          className={`text-sm font-bold leading-tight ${
            light ? "text-white" : "text-slate-900 dark:text-slate-100"
          }`}
        >
          SUNIL KHAD BEEJ BHANDER
        </h2>
      </div>
    </div>
  );
};

export default ShopLogo;

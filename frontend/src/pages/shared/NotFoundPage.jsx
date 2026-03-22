import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center text-white">
    <p className="text-sm uppercase tracking-[0.3em] text-brand-100">404</p>
    <h1 className="text-4xl font-bold">Page not found</h1>
    <Link to="/" className="rounded-full bg-brand-500 px-5 py-3 font-medium text-white">
      Back to app
    </Link>
  </div>
);

export default NotFoundPage;

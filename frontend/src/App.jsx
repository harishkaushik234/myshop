import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import { useAppContext } from "./hooks/useAppContext";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminScansPage from "./pages/admin/AdminScansPage";
import AdminCertificatesPage from "./pages/admin/AdminCertificatesPage";
import AdminFeedbackPage from "./pages/admin/AdminFeedbackPage";
import AIUploadPage from "./pages/client/AIUploadPage";
import CartPage from "./pages/client/CartPage";
import CertificatesPage from "./pages/client/CertificatesPage";
import ClientOrdersPage from "./pages/client/ClientOrdersPage";
import ClientOverviewPage from "./pages/client/ClientOverviewPage";
import ClientProductsPage from "./pages/client/ClientProductsPage";
import FeedbackPage from "./pages/client/FeedbackPage";
import ChatPage from "./pages/shared/ChatPage";
import LoginPage from "./pages/shared/LoginPage";
import NotFoundPage from "./pages/shared/NotFoundPage";
import RegisterPage from "./pages/shared/RegisterPage";

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="app-shell lg:grid lg:grid-cols-[288px_1fr]">
      <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-col">
        <Navbar onOpenSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
          <Routes>
            <Route index element={<RoleBasedHome />} />
            <Route path="products" element={<RoleBasedProducts />} />
            <Route path="orders" element={<RoleBasedOrders />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="cart" element={<ClientOnly><CartPage /></ClientOnly>} />
            <Route path="ai" element={<ClientOnly><AIUploadPage /></ClientOnly>} />
            <Route path="scans" element={<AdminOnly><AdminScansPage /></AdminOnly>} />
            <Route path="certificates" element={<RoleBasedCertificates />} />
            <Route path="feedback" element={<RoleBasedFeedback />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const { auth } = useAppContext();
  return auth.isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminOnly = ({ children }) => {
  const { auth } = useAppContext();
  return auth.user?.role === "admin" ? children : <Navigate to="/dashboard" replace />;
};

const ClientOnly = ({ children }) => {
  const { auth } = useAppContext();
  return auth.user?.role === "client" ? children : <Navigate to="/dashboard" replace />;
};

const RoleBasedHome = () => {
  const { auth } = useAppContext();
  return auth.user?.role === "admin" ? <AdminOverviewPage /> : <ClientOverviewPage />;
};

const RoleBasedProducts = () => {
  const { auth } = useAppContext();
  return auth.user?.role === "admin" ? <AdminProductsPage /> : <ClientProductsPage />;
};

const RoleBasedOrders = () => {
  const { auth } = useAppContext();
  return auth.user?.role === "admin" ? <AdminOrdersPage /> : <ClientOrdersPage />;
};

const RoleBasedCertificates = () => {
  const { auth } = useAppContext();
  return auth.user?.role === "admin" ? <AdminCertificatesPage /> : <CertificatesPage />;
};

const RoleBasedFeedback = () => {
  const { auth } = useAppContext();
  return auth.user?.role === "admin" ? <AdminFeedbackPage /> : <FeedbackPage />;
};

const App = () => {
  const { auth } = useAppContext();
  const defaultAuthedPath = auth.user?.role === "client" ? "/dashboard/products" : "/dashboard";

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={auth.isAuthenticated ? defaultAuthedPath : "/login"} replace />}
      />
      <Route
        path="/login"
        element={auth.isAuthenticated ? <Navigate to={defaultAuthedPath} replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={auth.isAuthenticated ? <Navigate to={defaultAuthedPath} replace /> : <RegisterPage />}
      />
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;

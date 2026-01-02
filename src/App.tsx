import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
// Admin Management (with Policy)
import AdminManagement from './pages/system/AdminManagement';
import AddAdmin from './pages/system/AddAdmin';
import UpdateAdmin from './pages/system/UpdateAdmin';
// Customer Management
import CustomerManagement from './pages/system/CustomerManagement';
import AddCustomer from './pages/system/AddCustomer';
import UpdateCustomer from './pages/system/UpdateCustomer';
// Provider Management
import ProviderManagement from './pages/system/ProviderManagement';
// Policy Management
import PolicyManagement from './pages/system/PolicyManagement';
import AddPolicy from './pages/system/AddPolicy';
import UpdatePolicy from './pages/system/UpdatePolicy';
// Category Management
import CategoryManagement from './pages/system/CategoryManagement';
import AddCategory from './pages/system/AddCategory';
import UpdateCategory from './pages/system/UpdateCategory';
// Provider Service Management
import ProviderServiceManagement from './pages/provider/ProviderServiceManagement';
import AddProviderService from './pages/provider/AddProviderService';
import UpdateProviderService from './pages/provider/UpdateProviderService';

import { authService } from './services/authService';
import { setNotificationApi } from './services/notificationService';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2e4baa',
        },
        components: {
          Menu: {
            itemSelectedBg: 'rgba(46, 75, 170, 0.1)',
            itemSelectedColor: '#2e4baa',
            itemHoverBg: 'rgba(46, 75, 170, 0.05)',
            itemHoverColor: '#2e4baa',
          },
        },
      }}
    >
      <AntApp>
        <AppContent />
      </AntApp>
    </ConfigProvider>
  );
}

function AppContent() {
  const { notification } = AntApp.useApp();

  // Set notification API for use in baseHttp
  useEffect(() => {
    setNotificationApi(notification);
  }, [notification]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          {/* Admin Management */}
          <Route path="admins" element={<AdminManagement />} />
          <Route path="admins/add" element={<AddAdmin />} />
          <Route path="admins/update" element={<UpdateAdmin />} />
          {/* Customer Management */}
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="customers/update" element={<UpdateCustomer />} />
          {/* Provider User Management */}
          <Route path="providers" element={<ProviderManagement />} />
          {/* Provider Service Management */}
          <Route path="provider-services" element={<ProviderServiceManagement />} />
          <Route path="provider-services/add" element={<AddProviderService />} />
          <Route path="provider-services/update" element={<UpdateProviderService />} />
          {/* Policy Management */}
          <Route path="policies" element={<PolicyManagement />} />
          <Route path="policies/add" element={<AddPolicy />} />
          <Route path="policies/update" element={<UpdatePolicy />} />
          {/* Category Management */}
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/update" element={<UpdateCategory />} />
          {/* Bookings - Coming Soon */}
          <Route path="bookings" element={<div className="p-6"><h2>Quản Lý Đặt Lịch (Coming Soon)</h2></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

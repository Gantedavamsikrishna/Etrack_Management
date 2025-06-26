import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReportsProvider } from './context/ReportsContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Floor } from './pages/Floor';
import { Hall } from './pages/Hall';
import { Room } from './pages/Room';
import { Inventory } from './pages/Inventory';
import { BuildingMap } from './pages/BuildingMap';
import AdminDetails from './pages/AdminDetails';
import  AddFloor from './pages/AddFloor';
import { Reports } from './pages/Reports';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/inventory" element={
        <ProtectedRoute>
          <Layout>
            <Inventory />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/map" element={
        <ProtectedRoute>
          <Layout>
            <BuildingMap />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/reports" element={
        <ProtectedRoute>
          <Layout>
            <Reports />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/floors/:floorId" element={
        <ProtectedRoute>
          <Layout>
            <Floor />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/floors/:floorId/halls/:hallId" element={
        <ProtectedRoute>
          <Layout>
            <Hall />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/floors/:floorId/halls/:hallId/rooms/:roomId" element={
        <ProtectedRoute>
          <Layout>
            <Room />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin-details" element={
        <ProtectedRoute>
          <Layout>
            <AdminDetails />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/add-floor" element={
        <ProtectedRoute>
          <Layout>
            <AddFloor />
          </Layout>
        </ProtectedRoute>
      } />

      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
      <ThemeProvider>
        <AuthProvider>
          <ReportsProvider>
            <AppRoutes />
          </ReportsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
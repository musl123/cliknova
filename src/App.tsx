import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import HomePage from './pages/public/HomePage';
import Shop from './pages/public/Shop';
import ProductPage from './pages/public/ProductPage';
import Checkout from './pages/public/Checkout';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseViewer from './pages/student/CourseViewer';
import ProducerDashboard from './pages/producer/ProducerDashboard';
import CourseManagement from './pages/producer/CourseManagement';
import AffiliateDashboard from './pages/affiliate/AffiliateDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/loja" element={<Layout><Shop /></Layout>} />
      <Route path="/produto/:id" element={<Layout><ProductPage /></Layout>} />
      <Route path="/checkout/:id" element={<Layout><Checkout /></Layout>} />
      
      {/* Rotas de autenticação */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/registo" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/recuperar-senha" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
      
      {/* Dashboard - redireciona baseado no tipo de utilizador */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardRedirect />
        </ProtectedRoute>
      } />
      
      {/* Rotas do aluno */}
      <Route path="/aluno/*" element={
        <ProtectedRoute allowedRoles={['aluno']}>
          <Routes>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="curso/:id" element={<CourseViewer />} />
          </Routes>
        </ProtectedRoute>
      } />
      
      {/* Rotas do produtor */}
      <Route path="/produtor/*" element={
        <ProtectedRoute allowedRoles={['produtor']}>
          <Routes>
            <Route path="dashboard" element={<ProducerDashboard />} />
            <Route path="cursos" element={<CourseManagement />} />
          </Routes>
        </ProtectedRoute>
      } />
      
      {/* Rotas do afiliado */}
      <Route path="/afiliado/*" element={
        <ProtectedRoute allowedRoles={['afiliado']}>
          <Routes>
            <Route path="dashboard" element={<AffiliateDashboard />} />
          </Routes>
        </ProtectedRoute>
      } />
      
      {/* Rotas do administrador */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Routes>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function DashboardRedirect() {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  switch (user.tipo_utilizador) {
    case 'admin':
      return <Navigate to="/admin/dashboard" />;
    case 'produtor':
      return <Navigate to="/produtor/dashboard" />;
    case 'afiliado':
      return <Navigate to="/afiliado/dashboard" />;
    case 'aluno':
      return <Navigate to="/aluno/dashboard" />;
    default:
      return <Navigate to="/" />;
  }
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
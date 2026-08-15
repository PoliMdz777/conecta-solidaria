import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

import LandingPage       from './pages/LandingPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import DashboardPage     from './pages/DashboardPage';
import DetallePage       from './pages/DetallePage';
import CrearNecesidadPage from './pages/CrearNecesidadPage';
import PerfilPage        from './pages/PerfilPage';
import AdminPage         from './pages/AdminPage';
import ReportesPage from './pages/ReportesPage';
import OrganizacionesPage from './pages/OrganizacionesPage';
import NotificacionesPage from './pages/NotificacionesPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"               element={<LandingPage />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/dashboard"      element={<DashboardPage />} />
          <Route path="/necesidad/:id"  element={<DetallePage />} />
          <Route path="/crear"          element={<CrearNecesidadPage />} />
          <Route path="/perfil"         element={<PerfilPage />} />
          <Route path="/admin"          element={<AdminPage />} />
          <Route path="/reportes"       element={<ReportesPage />} />
          <Route path="/organizaciones" element={<OrganizacionesPage />} />
          <Route path="/notificaciones" element={<NotificacionesPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
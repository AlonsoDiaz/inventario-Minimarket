import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import SalesHistory from './pages/SalesHistory';
import CashClosure from './pages/CashClosure';
import Analytics from './pages/Analytics';

const AppLayout = ({ children }) => {
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/': return 'Panel de Control';
      case '/pos': return 'Punto de Venta';
      case '/inventory': return 'Gestión de Inventario';
      case '/history': return 'Historial de Ventas';
      case '/closure': return 'Cierre de Caja';
      case '/analytics': return 'Reportes Avanzados';
      default: return 'Minimarket';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: '280px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header title={getPageTitle(location.pathname)} />
        <div style={{ padding: '0', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <StoreProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/history" element={<SalesHistory />} />
            <Route path="/closure" element={<CashClosure />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </AppLayout>
      </Router>
    </StoreProvider>
  );
}

export default App;

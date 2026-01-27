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

// Layout wrapper to handle Header Titles
const AppLayout = ({ children }) => {
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/': return 'Panel de Control';
      case '/inventory': return 'Gestión de Inventario';
      case '/pos': return 'Terminal Punto de Venta';
      case '/history': return 'Historial de Ventas';
      case '/closure': return 'Cierre de Caja';
      default: return 'MiniMarket';
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
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/history" element={<SalesHistory />} />
            <Route path="/closure" element={<CashClosure />} />
          </Routes>
        </AppLayout>
      </Router>
    </StoreProvider>
  );
}

export default App;

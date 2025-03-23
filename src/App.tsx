import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EcoDriveAnalysis from './pages/EcoDriveAnalysis';
import EcoDriveMarketplace from './pages/EcoDriveMarketplace';
import Login from './pages/Login';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar />}
        <main className="pt-16">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/analysis"
              element={isAuthenticated ? <EcoDriveAnalysis /> : <Navigate to="/login" />}
            />
            <Route
              path="/marketplace"
              element={isAuthenticated ? <EcoDriveMarketplace /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

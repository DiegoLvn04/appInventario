import {  BrowserRouter,  Routes,  Route,  Navigate} from 'react-router-dom';

import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import CrudProductos from './components/Productos/crudProductos';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <ProtectedRoute>
              <CrudProductos />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

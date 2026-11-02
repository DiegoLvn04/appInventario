
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [usuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('usuario') || 'null');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let activo = true;

    const obtenerProductos = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await api.get('/api/productos', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (activo) {
          setProductos(
            Array.isArray(response.data) ? response.data : []
          );
        }
      } catch (err) {
        if (activo) {
          setError('No se pudo cargar el inventario.');
        }
      } finally {
        if (activo) setLoading(false);
      }
    };

    obtenerProductos();

    return () => {
      activo = false;
    };
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/', { replace: true });
  };

  const totalProductos = productos.length;

  const stockTotal = productos.reduce(
    (total, p) => total + (Number(p.stock) || 0),
    0
  );

  const stockBajo = productos.filter(
    (p) => Number(p.stock) <= 5
  ).length;

  return (
    <div className="dashboard">

      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <div className="dashboard-logo-icon">S</div>
          <div>
            <strong>SENATI</strong>
            <small>Gestión de Inventarios</small>
          </div>
        </div>

        <p className="dashboard-menu-label">MENÚ PRINCIPAL</p>

        <nav className="dashboard-menu" aria-label="Navegación principal">
          <button className="dashboard-menu-active" type="button">
            <span>▦</span> Panel principal
          </button>

          <button
            type="button"
            onClick={() => navigate('/productos')}
          >
            <span>▣</span> Gestión de productos
          </button>
        </nav>

        <div className="dashboard-sidebar-bottom">
          <div className="dashboard-user">
            <div className="dashboard-avatar">
              {(usuario?.nombre || 'U').charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{usuario?.nombre || 'Usuario'}</strong>
              <small>{usuario?.rol || 'Sin rol'}</small>
            </div>
          </div>

          <button
            className="dashboard-logout"
            type="button"
            onClick={cerrarSesion}
          >
            ↪ Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">
              SISTEMA INTEGRAL DE INVENTARIOS
            </span>
            <h1>Panel de control</h1>
          </div>

          <span className="dashboard-role">
            {usuario?.rol || 'Usuario'}
          </span>
        </header>

        <section className="dashboard-welcome">
          <span className="dashboard-welcome-tag">
            ESPACIO DE TRABAJO
          </span>

          <h2>
            ¡Bienvenido, {usuario?.nombre || 'Usuario'}!
          </h2>

          <p>
            Administra tus productos, consulta el estado del
            inventario y mantén organizada tu información
            desde un solo lugar.
          </p>

          <button
            type="button"
            onClick={() => navigate('/productos')}
          >
            Gestionar productos →
          </button>
        </section>

        <section className="dashboard-overview">
          <div className="dashboard-section-title">
            <div>
              <h2>Resumen del inventario</h2>
              <p>Información obtenida de tu sistema.</p>
            </div>
          </div>

          {error && (
            <p className="dashboard-error" role="alert">
              {error}
            </p>
          )}

          <div className="dashboard-stats">
            <article className="dashboard-stat">
              <span className="dashboard-stat-icon">▣</span>
              <p>Total de productos</p>
              <strong>
                {loading || error ? '—' : totalProductos}
              </strong>
              <small>Productos registrados</small>
            </article>

            <article className="dashboard-stat">
              <span className="dashboard-stat-icon">▤</span>
              <p>Unidades disponibles</p>
              <strong>
                {loading || error ? '—' : stockTotal}
              </strong>
              <small>Stock total</small>
            </article>

            <article className="dashboard-stat">
              <span className="dashboard-stat-icon">!</span>
              <p>Stock bajo</p>
              <strong>
                {loading || error ? '—' : stockBajo}
              </strong>
              <small>Productos con 5 unidades o menos</small>
            </article>

            <article className="dashboard-stat">
              <span className="dashboard-stat-icon">✓</span>
              <p>Rol de acceso</p>
              <strong className="dashboard-stat-role">
                {usuario?.rol || 'Usuario'}
              </strong>
              <small>Perfil de la sesión</small>
            </article>
          </div>
        </section>

        <section className="dashboard-actions">
          <div>
            <h2>Accesos rápidos</h2>
            <p>Continúa con las operaciones de inventario.</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/productos')}
          >
            <span className="dashboard-action-icon">+</span>

            <span>
              <strong>Administrar productos</strong>
              <small>
                Crear, consultar, editar y eliminar productos
              </small>
            </span>

            <span className="dashboard-action-arrow">→</span>
          </button>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

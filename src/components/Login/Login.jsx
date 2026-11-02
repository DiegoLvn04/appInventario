
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [credenciales, setCredenciales] = useState({
    email: '',
    password: ''
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredenciales((prev) => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email: credenciales.email.trim(),
        password: credenciales.password
      });

      const { token, usuario } = response.data;

      if (!token || !usuario) {
        throw new Error('Respuesta de autenticación incompleta');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      navigate('/Dashboard', { replace: true });
    } catch (err) {
      const mensaje =
        err.response?.status === 401 ||
        err.response?.status === 400
          ? 'Correo o contraseña incorrectos.'
          : 'No fue posible iniciar sesión. Inténtalo nuevamente.';

      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-shell">

        {/* PANEL INFORMATIVO */}
        <section className="login-brand">
          <div className="brand-top">
            <div className="brand-logo">S</div>

            <div className="brand-identity">
              <strong>SENATI</strong>
              <span>Gestión de Inventarios</span>
            </div>
          </div>

          <div className="brand-content">
            <div className="brand-label">
              <span className="brand-dot" />
              PLATAFORMA DE GESTIÓN
            </div>

            <h1>
              El control de tu
              <br />
              inventario,
              <br />
              <span>simplificado.</span>
            </h1>

            <p>
              Una plataforma diseñada para organizar,
              administrar y supervisar tus recursos
              de manera eficiente y centralizada.
            </p>

            <div className="brand-features">
              <div className="brand-feature">
                <span className="feature-symbol">✓</span>
                Gestión centralizada de productos
              </div>

              <div className="brand-feature">
                <span className="feature-symbol">✓</span>
                Información organizada y accesible
              </div>

              <div className="brand-feature">
                <span className="feature-symbol">✓</span>
                Acceso mediante autenticación
              </div>
            </div>
          </div>

          <div className="brand-footer">
            <span>© {new Date().getFullYear()} Portal SENATI</span>

            <span className="brand-footer-status">
              <span className="status-dot" />
              Plataforma institucional
            </span>
          </div>
        </section>

        {/* PANEL DE AUTENTICACIÓN */}
        <section className="login-form-panel">
          <div className="login-form-container">

            <div className="mobile-brand">
              <div className="brand-logo">S</div>
              <strong>SENATI</strong>
            </div>

            <div className="login-heading">
              <div className="login-welcome-icon" aria-hidden="true">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  <path d="M12 14v3" />
                </svg>
              </div>

              <span className="login-eyebrow">ACCESO AL SISTEMA</span>

              <h2>Bienvenido de nuevo</h2>

              <p>
                Ingresa tus credenciales para acceder al
                sistema de inventarios.
              </p>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <span aria-hidden="true">!</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">

              <div className="input-group-custom">
                <label htmlFor="email">
                  Correo electrónico
                </label>

                <div className="input-wrapper">
                  <svg
                    className="input-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="nombre@senati.pe"
                    autoComplete="username"
                    value={credenciales.email}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={Boolean(error)}
                    required
                  />
                </div>
              </div>

              <div className="input-group-custom">
                <label htmlFor="password">
                  Contraseña
                </label>

                <div className="input-wrapper">
                  <svg
                    className="input-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>

                  <input
                    id="password"
                    type={mostrarPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    value={credenciales.password}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={Boolean(error)}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setMostrarPassword((prev) => !prev)}
                    aria-label={
                      mostrarPassword
                        ? 'Ocultar contraseña'
                        : 'Mostrar contraseña'
                    }
                    aria-pressed={mostrarPassword}
                  >
                    {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner" aria-hidden="true" />
                    Verificando acceso...
                  </>
                ) : (
                  <>
                    Iniciar sesión
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

            </form>

            <div className="login-help">
              <span className="help-icon" aria-hidden="true">i</span>
              ¿Problemas para acceder? Contacta al administrador
              del sistema.
            </div>

            <div className="login-bottom">
              <span>Portal SENATI</span>
              <span>Acceso institucional</span>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;

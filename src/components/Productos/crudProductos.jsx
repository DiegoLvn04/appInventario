import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const CrudProductos = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    obtenerProductos();
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const obtenerProductos = async () => {
    try {
      const response = await api.get('/api/productos', getHeaders());
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/api/productos/${form.id}`, form, getHeaders());
      } else {
        await api.post("/api/productos", form, getHeaders());
      }
      setForm({ id: null, nombre: "", descripcion: "", precio: "", stock: "" });
      obtenerProductos();
    } catch (error) {
      alert("Error al guardar el producto. Verifique sus permisos.");
    }
  };

  const handleEdit = (producto) => {
    setForm(producto);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await api.delete(`/api/productos/${id}`, getHeaders());
        obtenerProductos();
      } catch (error) {
        alert("No cuenta con permisos para eliminar.");
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-dark">Gestión de Inventario</h2>
          <p className="text-muted">Administre los productos de manera ágil y segura.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h4 className="fw-semibold mb-3 text-primary">{form.id ? "Editar Producto" : "Nuevo Producto"}</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control bg-light border-0"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  className="form-control bg-light border-0"
                  value={form.descripcion}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Precio (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  name="precio"
                  className="form-control bg-light border-0"
                  value={form.precio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Stock</label>
                <input
                  type="number"
                  name="stock"
                  className="form-control bg-light border-0"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold rounded-3">
                {form.id ? "Actualizar Producto" : "Guardar Producto"}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h4 className="fw-semibold mb-3">Lista de Productos</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((prod) => (
                    <tr key={prod.id}>
                      <td className="fw-semibold">#{prod.id}</td>
                      <td>{prod.nombre}</td>
                      <td>S/ {Number(prod.precio).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${prod.stock > 5 ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {prod.stock} un.
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-warning btn-sm me-2 rounded-2 px-3"
                          onClick={() => handleEdit(prod)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-2 px-3"
                          onClick={() => handleDelete(prod.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {productos.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">No hay productos registrados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudProductos;
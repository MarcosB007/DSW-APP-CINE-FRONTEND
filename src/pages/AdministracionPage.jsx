import t, { useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import '../styles/administracionPage.css'


const PELICULAS_MOCK = [
    { id: 1, titulo: "Avatar: El camino del agua" },
    { id: 2, titulo: "El Gato con Botas" },
    { id: 3, titulo: "Oppenheimer" },
    { id: 4, titulo: "Barbie" }
];

const SALAS_MOCK = [
    { id: 1, nombre: "Sala 1", capacidad: 50 },
    { id: 2, nombre: "Sala IMAX", capacidad: 120 },
    { id: 3, nombre: "Sala VIP", capacidad: 30 }
];

export const AdministracionPage = () => {

    const [mostrarModal, setMostrarModal] = useState(false);

    // Estado para la lista de funciones (inicialmente vacía o con datos de prueba)
    const [funciones, setFunciones] = useState([
        { id: 1, pelicula: "Avatar: El camino del agua", sala: "Sala IMAX", fecha: "2025-11-18T18:00", precio: 5000 },
        { id: 2, pelicula: "Avatar: El camino del agua", sala: "Sala IMAX", fecha: "2025-11-18T18:00", precio: 5000 }
    ]);

    // Estado para el formulario
    const [nuevaFuncion, setNuevaFuncion] = useState({
        peliculaId: '',
        salaId: '',
        fecha: '',
        precio: ''
    });

    // Manejar cambios en los inputs del formulario
    const handleInputChange = (e) => {
        setNuevaFuncion({
            ...nuevaFuncion,
            [e.target.name]: e.target.value
        });
    };

    // Guardar la función (Simulación)
    const handleSubmit = (e) => {
        e.preventDefault();

        // Buscamos los nombres basados en los IDs seleccionados para mostrar en la tabla
        const peliNombre = PELICULAS_MOCK.find(p => p.id === parseInt(nuevaFuncion.peliculaId))?.titulo || "Desconocida";
        const salaNombre = SALAS_MOCK.find(s => s.id === parseInt(nuevaFuncion.salaId))?.nombre || "Desconocida";

        const funcionAGuardar = {
            id: Date.now(), // ID temporal único
            pelicula: peliNombre,
            sala: salaNombre,
            fecha: nuevaFuncion.fecha,
            precio: nuevaFuncion.precio
        };

        setFunciones([...funciones, funcionAGuardar]);
        setMostrarModal(false); // Cerrar modal
        setNuevaFuncion({ peliculaId: '', salaId: '', fecha: '', precio: '' }); // Limpiar form
    };

    // Eliminar función
    const handleEliminar = (id) => {
        setFunciones(funciones.filter(f => f.id !== id));
    };

    return (

        <div className="d-flex flex-column min-vh-100 mt-5">
            <Header />
            <div className="container mt-5 mb-5 text-white">

                {/* --- CABECERA --- */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold">Gestión de Cartelera</h2>
                        <p className="text-muted">Administra los horarios y precios de las películas.</p>
                    </div>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => setMostrarModal(true)}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        + Agregar Función
                    </button>
                </div>

                {/* --- TABLA DE FUNCIONES --- */}
                <div className="table-responsive shadow rounded">
                    <table className="table table-custom w-100">
                        <thead className="table-secondary">
                            <tr>
                                <th>Película</th>
                                <th>Sala</th>
                                <th>Fecha y Hora</th>
                                <th>Precio Ticket</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funciones.length > 0 ? (
                                funciones.map((func) => (
                                    <tr key={func.id}>
                                        <td className="fw-bold text-primary">{func.pelicula}</td>
                                        <td>{func.sala}</td>
                                        {/* Formateamos un poco la fecha para que se vea linda */}
                                        <td>{new Date(func.fecha).toLocaleString()}</td>
                                        <td>${func.precio}</td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleEliminar(func.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        No hay funciones cargadas. Agrega una nueva.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- MODAL MANUAL (Para no depender de JS de Bootstrap complejo) --- */}
                {mostrarModal && (
                    <div className="modal-backdrop-custom">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content bg-dark text-white border-secondary">
                                <div className="modal-header border-secondary">
                                    <h5 className="modal-title">Nueva Función</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModal(false)}></button>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">

                                        {/* Selector Película */}
                                        <div className="mb-3">
                                            <label className="form-label">Película</label>
                                            <select
                                                className="form-select form-select-dark"
                                                name="peliculaId"
                                                required
                                                value={nuevaFuncion.peliculaId}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Seleccione una película...</option>
                                                {PELICULAS_MOCK.map(p => (
                                                    <option key={p.id} value={p.id}>{p.titulo}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Selector Sala */}
                                        <div className="mb-3">
                                            <label className="form-label">Sala y Capacidad</label>
                                            <select
                                                className="form-select form-select-dark"
                                                name="salaId"
                                                required
                                                value={nuevaFuncion.salaId}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Seleccione una sala...</option>
                                                {SALAS_MOCK.map(s => (
                                                    <option key={s.id} value={s.id}>
                                                        {s.nombre} (Cap: {s.capacidad} pers.)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Fecha y Hora */}
                                        <div className="mb-3">
                                            <label className="form-label">Fecha y Horario</label>
                                            <input
                                                type="datetime-local"
                                                className="form-control form-control-dark"
                                                name="fecha"
                                                required
                                                value={nuevaFuncion.fecha}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        {/* Precio */}
                                        <div className="mb-3">
                                            <label className="form-label">Precio Entrada ($)</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-dark"
                                                placeholder="Ej: 4500"
                                                name="precio"
                                                required
                                                min="0"
                                                value={nuevaFuncion.precio}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                    </div>
                                    <div className="modal-footer border-secondary">
                                        <button type="button" className="btn btn-secondary" onClick={() => setMostrarModal(false)}>Cancelar</button>
                                        <button type="submit" className="btn btn-primary">Guardar Función</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>


    );
}


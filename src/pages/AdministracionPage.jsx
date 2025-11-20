import t, { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import api from '../api/axios.js';
import '../styles/administracionPage.css'

export const AdministracionPage = () => {

    const [PELICULAS_MOCK, setPELICULAS_MOCK] = useState([]);
    const [SALAS_MOCK, setSALAS_MOCK] = useState([]);

    const [mostrarModal, setMostrarModal] = useState(false);

    // Estado para la lista de funciones (inicialmente vacía o con datos de prueba)
    const [funciones, setFunciones] = useState([]);

    // Estado para el formulario
    const [nuevaFuncion, setNuevaFuncion] = useState({
        PELICULA_id: '',
        SALA_id: '',
        fecha: '',
        precio: ''
    });

    // FUNCION PARA TRAER LAS PELICULAS y SALAS
    useEffect(() => {
        const cargarPeliculasySalas = async () => {

            try {
                const res = await api.get('/peliculas');

                setPELICULAS_MOCK(res.data);
            } catch (error) {
                console.error("Error al cargar las películas:", error);
            }
        };

        const cargarSalas = async () => {
            try {
                const res = await api.get('/getSalas');
                setSALAS_MOCK(res.data);
            } catch (error) {
                console.error("Error al cargar las salas:", error);
            }
        }

        const cargarFunciones = async () => {
            try {
                const res = await api.get('/getFuncionesForAdmin');
                setFunciones(res.data);
            } catch (error) {
                console.error("Error al cargar las funciones:", error);
            }
        };

        cargarPeliculasySalas();
        cargarFunciones();
        cargarSalas();
    }, [])


    // Manejar cambios en los inputs del formulario
    const handleInputChange = (e) => {
        setNuevaFuncion({
            ...nuevaFuncion,
            [e.target.name]: e.target.value
        });
    };

    // Guardar la función (Simulación)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nuevaFuncion.PELICULA_id || !nuevaFuncion.SALA_id || !nuevaFuncion.fecha || !nuevaFuncion.precio) {
            alert("Completa todos los campos");
            return;
        }

        try {
            // 1. Preparamos los datos
            const [fechaSola, horaSola] = nuevaFuncion.fecha.split('T');

            const datosParaEnviar = {
                PELICULA_id: parseInt(nuevaFuncion.PELICULA_id),
                SALA_id: parseInt(nuevaFuncion.SALA_id),
                fecha: fechaSola,
                hora: horaSola,
                precio: parseFloat(nuevaFuncion.precio) // <--- Enviamos el precio aquí mismo
            };

            // 2. Enviamos TODO en una sola petición a un nuevo endpoint
            // Nota: Asegúrate de crear esta ruta en tu backend
            const res = await api.post('/agregarFuncionEntrada', datosParaEnviar);

            // El backend debería devolver el ID de la función creada
            const idNuevaFuncion = res.data.id;

            // 3. Actualizamos la tabla visualmente (Igual que antes)
            const peliNombre = PELICULAS_MOCK.find(p => p.id === parseInt(nuevaFuncion.PELICULA_id))?.nombre || "Desconocida";
            const salaNombre = SALAS_MOCK.find(s => s.id === parseInt(nuevaFuncion.SALA_id))?.nombre || "Desconocida";

            const funcionParaTabla = {
                id: idNuevaFuncion,
                pelicula: peliNombre,
                sala: salaNombre,
                fecha: nuevaFuncion.fecha,
                precio: nuevaFuncion.precio
            };

            setFunciones([...funciones, funcionParaTabla]);
            setMostrarModal(false);
            setNuevaFuncion({ PELICULA_id: '', SALA_id: '', fecha: '', precio: '' });
            alert("¡Función y precio creados correctamente!");

        } catch (error) {
            console.error("Error:", error);
            alert("Error al crear la función. No se guardó nada.");
        }
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
                                                name="PELICULA_id"
                                                required
                                                value={nuevaFuncion.PELICULA_id}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Seleccione una película...</option>
                                                {PELICULAS_MOCK.map(p => (
                                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Selector Sala */}
                                        <div className="mb-3">
                                            <label className="form-label">Sala y Capacidad</label>
                                            <select
                                                className="form-select form-select-dark"
                                                name="SALA_id"
                                                required
                                                value={nuevaFuncion.SALA_id}
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


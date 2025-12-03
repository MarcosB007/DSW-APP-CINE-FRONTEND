import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';
import api from '../api/axios.js';
import { useNavigate } from 'react-router-dom';
import '../styles/listarPeliculas.css';
import Swal from 'sweetalert2';

function ListarPeliculasPage() {
    const navigate = useNavigate();
    // 1. Estados para guardar los datos de la BD
    const [peliculas, setPeliculas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtroCategoria, setFiltroCategoria] = useState('');

    // 2. Cargar datos cuando se abre la página
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // NOTA: Asumo que en tus rutas (routes.js) definiste estos endpoints
                // Si tus rutas se llaman distinto, cambia '/peliculas' por lo que corresponda.
                const resPeliculas = await api.get('/peliculas');
                const resCategorias = await api.get('/categorias');

                setPeliculas(resPeliculas.data);
                setCategorias(resCategorias.data);
            } catch (error) {
                console.error("Error al cargar las películas o categorías:", error);
                // Aquí podrías poner una alerta de error si quieres
            }
        };

        cargarDatos();
    }, []);
    // --- LÓGICA DE ELIMINAR (BAJA LÓGICA) ---
    const handleEliminar = (id) => {
        // 1. Disparamos la alerta de confirmación
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esta acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            // 2. Si el usuario hace clic en "Sí, dar de baja"...
            if (result.isConfirmed) {
                try {
                    // Hacemos la petición al backend
                    await api.put(`/eliminarPelicula?id=${id}`);

                    // Actualizamos la tabla visualmente
                    setPeliculas(peliculas.filter(p => p.id !== id));

                    // 3. Mostramos alerta de Éxito
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "La película ha sido dada de baja con éxito.",
                        icon: "success"
                    });

                } catch (error) {
                    console.error("Error al eliminar:", error);

                    // 4. Mostramos alerta de Error (si falla el backend)
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al intentar eliminar la película.",
                        icon: "error"
                    });
                }
            }
        });
    };

    // 3. Función auxiliar para obtener el nombre de la categoría según el ID
    const getNombreCategoria = (idCategoria) => {
        const categoriaEncontrada = categorias.find(c => c.id === idCategoria);
        return categoriaEncontrada ? categoriaEncontrada.nombre : 'Sin Categoría';
    };

    // Si hay algo en 'filtroCategoria', filtramos. Si no, mostramos todas.
    const peliculasFiltradas = filtroCategoria
        ? peliculas.filter(p => p.CATEGORIA_id == filtroCategoria)
        : peliculas;
    const handleEditar = (id) => {
        // Esto le dice al navegador: "Ve a la ruta /admin/editar-pelicula/ EL ID"
        navigate(`/admin/editar-pelicula/${id}`);
    };
    return (
        <div className='admin-page-wrapper'>
            <Header />

            <div className='admin-content'>
                <Container>
                    <div className="admin-header-container">
                        <h2 className="admin-title">Gestión de Películas</h2>
                        <div style={{ width: '200px' }}>
                            <select
                                className="form-select bg-dark text-white border-secondary"
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                            >
                                <option value="">Todas las categorías</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className="table-responsive rounded shadow-sm">
                        <table className="table table-dark-custom table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Género</th>
                                    <th>Estreno</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 4. AQUÍ OCURRE LA MAGIA: Mapeamos los datos reales */}
                                {peliculasFiltradas.length > 0 ? (
                                    peliculasFiltradas.map((pelicula) => (
                                        <tr key={pelicula.id}>
                                            {/* ID (Negrita por CSS anterior) */}
                                            <td>{pelicula.id}</td>

                                            {/* Título (Tu backend usa 'nombre', no 'titulo') */}
                                            <td className="fw-bold">{pelicula.nombre}</td>

                                            {/* Género (Buscamos el nombre usando el ID) */}
                                            <td>{getNombreCategoria(pelicula.CATEGORIA_id)}</td>

                                            {/* Estreno (Tu backend usa 1 o 0, lo convertimos a texto) */}
                                            <td>
                                                {pelicula.estreno === 1 ? (
                                                    <span className="badge bg-success">Sí</span>
                                                ) : (
                                                    <span className="badge bg-secondary">No</span>
                                                )}
                                            </td>

                                            <td className="text-end">
                                                <button className="btn btn-sm btn-primary me-2"
                                                    onClick={() => handleEditar(pelicula.id)}
                                                >
                                                    Editar
                                                </button>
                                                <button className="btn btn-sm btn-danger"
                                                    onClick={() => handleEliminar(pelicula.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No hay películas cargadas o no se pudo conectar al servidor.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Container>
            </div>

            <Footer />
        </div>
    );
}

export default ListarPeliculasPage;
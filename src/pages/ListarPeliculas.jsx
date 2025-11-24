import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';
import api from '../api/axios.js';
import '../styles/listarPeliculas.css';

function ListarPeliculasPage() {
    // 1. Estados para guardar los datos de la BD
    const [peliculas, setPeliculas] = useState([]);
    const [categorias, setCategorias] = useState([]);

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

    // 3. Función auxiliar para obtener el nombre de la categoría según el ID
    const getNombreCategoria = (idCategoria) => {
        const categoriaEncontrada = categorias.find(c => c.id === idCategoria);
        return categoriaEncontrada ? categoriaEncontrada.nombre : 'Sin Categoría';
    };

    return (
        <div className='admin-page-wrapper'>
            <Header />

            <div className='admin-content'>
                <Container>
                    <div className="admin-header-container">
                        <h2 className="admin-title">Gestión de Películas</h2>
                        <button className="btn btn-genero">
                            Filtrar por Género
                        </button>
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
                                {peliculas.length > 0 ? (
                                    peliculas.map((pelicula) => (
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
                                                <button className="btn btn-sm btn-primary me-2">
                                                    Editar
                                                </button>
                                                <button className="btn btn-sm btn-danger">
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
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
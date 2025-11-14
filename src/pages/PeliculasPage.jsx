// src/components/HomePage.jsx
import { useEffect } from 'react';
import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/peliculaspage.css';
import { useAuth } from '../context/AuthContext';

import api from '../api/axios.js';
import { replace } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';

const BACKEND_URL = 'http://localhost:3001';

// Función helper para mostrar imágenes
const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/200x300/222/fff?text=No+Image';
    if (path.startsWith('http')) {
        return path;
    }
    const correctedPath = path.replace(/\\/g, '/').replace(/^\/+/, '');
    return `${BACKEND_URL}/${correctedPath}`;
};


export function PeliculasPage() {
    const [peliculas, setPeliculas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
    const [nuevaPelicula, setNuevaPelicula] = useState({
        nombre: '',
        duracion: '',
        lanzamiento: '',
        descripcion: '',
        imagen: null,
        CATEGORIA_id: 1,
    });

    useEffect(() => {
        // Definimos una función 'async' adentro
        const cargarCategorias = async () => {
            try {
                const res = await api.get('/categorias');

                setCategorias(res.data);
            } catch (error) {
                console.error("Error al cargar las categorias:", error);
            }
        };

        cargarCategorias();
    }, []);

    useEffect(() => {
        // Definimos una función 'async' adentro
        const cargarPeliculas = async () => {
            try {
                const res = await api.get('/peliculas');

                setPeliculas(res.data);
            } catch (error) {
                console.error("Error al cargar las películas:", error);
            }
        };

        cargarPeliculas();
    }, []);

    const { user } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevaPelicula({ ...nuevaPelicula, [name]: value });
    };

    // Guarda el *archivo* seleccionado en el estado
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNuevaPelicula({ ...nuevaPelicula, imagen: e.target.files[0] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validar que se haya seleccionado una imagen
        if (!nuevaPelicula.imagen) {
            alert("Por favor, selecciona una imagen.");
            return;
        }

        // 2. Crear el FormData
        const formData = new FormData();
        formData.append('nombre', nuevaPelicula.nombre);
        formData.append('duracion', nuevaPelicula.duracion);
        formData.append('lanzamiento', nuevaPelicula.lanzamiento);
        formData.append('descripcion', nuevaPelicula.descripcion);
        formData.append('CATEGORIA_id', nuevaPelicula.CATEGORIA_id);
        formData.append('imagen', nuevaPelicula.imagen);

        try {
            // 3. Usar 'api' (con cookies) y la ruta '/agregarPelicula'
            const res = await api.post('/agregarPelicula', formData);

            // 4. ¡Éxito! Añade la nueva película (res.data) a la lista
            setPeliculas([...peliculas, res.data]);
            setIsModalOpen(false); // Cierra el modal


            // 5. Resetea el formulario
            setNuevaPelicula({
                nombre: '', duracion: '', lanzamiento: '', descripcion: '', CATEGORIA_id: 1, imagen: null
            });

        } catch (error) {
            console.error("Error al subir la película:", error.response?.data?.message || error.message);
            alert(`Error al subir la película: ${error.response?.data?.message || 'Revisa la consola'}`);
        }
    };

    const handleFiltrarCategoria = async (categoriaKey) => {
        // 1. Actualiza el estado del filtro
        setCategoriaFiltro(categoriaKey);

        // 2. Aquí va tu lógica para buscar las películas
        console.log(`Buscando películas de la categoría: ${categoriaKey}`);

        try {
            let res
            if (categoriaKey === 'todos') {
                res = await api.get('/peliculas');
            } else {
                res = await api.get('/peliculasPorCategoria', {
                    params: {
                        CATEGORIA_id: categoriaKey
                    }
                });
            }
            setPeliculas(res.data);
        } catch (error) {
            console.error("Error al cargar las películas:", error);
        }
    };


    return (
        <div className='app-container'>
            <Header />

            <main className='main-content'>
                <div className='cartelera-header'>
                    <h2>Cartelera</h2>


                    <NavDropdown
                        title="Géneros"
                        id="basic-nav-dropdown"
                        className='categorias'
                        onSelect={handleFiltrarCategoria} // <-- ¡AQUÍ! Llama a tu función
                    >
                        {/* Opción para ver todas */}
                        <NavDropdown.Item eventKey="todos">Ver Todos</NavDropdown.Item>
                        <NavDropdown.Divider />

                        {/* Mapeamos el mismo array de categorías del modal */}
                        {categorias.map((categoria) => (
                            <NavDropdown.Item
                                key={categoria.id}
                                eventKey={categoria.id}
                            >
                                {categoria.nombre}
                            </NavDropdown.Item>
                        ))}
                    </NavDropdown>

                    {user?.rol === 'admin' && (
                        <button className='btn-agregar' onClick={() => setIsModalOpen(true)}>
                            + Agregar Película
                        </button>
                    )}
                </div>



                <div className='cartelera-grid'>
                    {peliculas.map((pelicula) => (
                        <div key={pelicula.id} className='pelicula-card'>
                            <img src={getImageUrl(pelicula.imagen)} alt={pelicula.nombre} />
                            <div className='pelicula-info'>
                                <h3>{pelicula.nombre}</h3>
                                {/* Mostramos solo el año (ej: 2024) */}
                                <p>{pelicula.duracion} - {pelicula.lanzamiento.split('-')[0]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {isModalOpen && (
                <div className='modal-overlay'>
                    <div className='modal-content'>
                        <form onSubmit={handleSubmit}>
                            <h2>Agregar Nueva Película</h2>
                            <button type="button" className='modal-close' onClick={() => setIsModalOpen(false)}>X</button>

                            <label htmlFor="nombre">Nombre</label>
                            <input type="text" id="nombre" name="nombre" placeholder="Nombre de la Película" value={nuevaPelicula.nombre} onChange={handleInputChange} required />

                            <label htmlFor="descripcion">Descripción</label>
                            <textarea id="descripcion" name="descripcion" placeholder="Descripción" value={nuevaPelicula.descripcion} onChange={handleInputChange} required />

                            <label htmlFor="duracion">Duración</label>
                            <input type="text" id="duracion" name="duracion" placeholder="Ej: 2h 30m" value={nuevaPelicula.duracion} onChange={handleInputChange} required />

                            <label htmlFor="lanzamiento">Fecha de Lanzamiento</label>
                            <input type="date" id="lanzamiento" name="lanzamiento" value={nuevaPelicula.lanzamiento} onChange={handleInputChange} required />

                            <label htmlFor="categoria">Categoría</label>
                            <select
                                id="categoria"
                                name="CATEGORIA_id"
                                value={nuevaPelicula.CATEGORIA_id}
                                onChange={handleInputChange}
                                required
                            >
                                {/* 1. Una opción deshabilitada para guiar al usuario */}
                                <option value="" disabled>Seleccione una categoría</option>

                                {/* 2. Mapeamos el array de categorías del estado */}
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {/* 3. Mostramos el NOMBRE al usuario */}
                                        {categoria.nombre}
                                        {/* 4. Pero el VALOR que se guarda es el ID */}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="imagen">Imagen de Portada</label>
                            <input type="file" id="imagen" name="imagen" accept="image/*" onChange={handleImageChange} required />

                            <button type="submit" className='btn-submit'>Agregar a Cartelera</button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
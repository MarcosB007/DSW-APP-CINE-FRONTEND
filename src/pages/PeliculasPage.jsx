// src/components/HomePage.jsx
import { useEffect } from 'react';
import React, { useState, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/peliculaspage.css';
import axios from "axios";

import api from '../api/axios.js';
import { replace, useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

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
    const { isAuthenticated, logout, user } = useAuth();

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
        estreno: 0
    });
    const [movieToBuy, setMovieToBuy] = useState(null);
    const [funcionesPorPelicula, setFuncionesPorPelicula] = useState([]);
    const [funcionSeleccionada, setFuncionSeleccionada] = useState(null);
    // Cantidad de entradas
    const [cantidad, setCantidad] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        initMercadoPago('APP_USR-026e37f1-7eb1-4e10-8b13-600adee9d908', {
            locale: 'es-AR'
        });
    }, []);

    const handleCloseModal = () => {
        setMovieToBuy(null);
        setFuncionSeleccionada(null);
        setFuncionesPorPelicula([]);
        setCantidad(1);
    };

    const incrementarCantidad = () => {
        if (cantidad < 10) setCantidad(cantidad + 1);
    };

    const decrementarCantidad = () => {
        if (cantidad > 1) setCantidad(cantidad - 1);
    };

    // 2. BUSCAMOS LA FUNCIÓN ENTERA (Para sacar el precio)
    const funcionActual = funcionesPorPelicula.find(f => f.id === funcionSeleccionada);

    // Calculamos el total
    const totalPagar = funcionActual ? funcionActual.precio * cantidad : 0;

    const handleIrAPagar = async () => {
        try {
            const funcionActual = funcionesPorPelicula.find(f => f.id === funcionSeleccionada);
            if (!funcionActual) return;

            const datosPago = {
                titulo: `Entrada: ${movieToBuy.nombre}`,
                cantidad: cantidad,
                precio: funcionActual.precio
            };

            // 1. Pedimos la preferencia al backend
            const res = await api.post('/createPreference', datosPago);

            if (res.data.init_point) {
                window.location.href = res.data.init_point;
            }

        } catch (error) {
            console.error("Error al redirigir:", error);
        }
    };

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
        formData.append('estreno', nuevaPelicula.estreno);

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

    const cargarFunciones = async (id) => {
        try {

            const res = await api.get('/getFuncionPorIdDePelicula', {
                params: {
                    PELICULA_id: id
                }
            });

            setFuncionesPorPelicula(res.data);

        } catch (error) {
            console.error("Error al cargar las funciones para esta pelicula:", error);
        }
    }

    const handleComprarClick = (pelicula) => {
        if (isAuthenticated) {
            setMovieToBuy(pelicula);
            cargarFunciones(pelicula.id)
        } else {
            Swal.fire({
                title: "Inicia sesión primero!",
                timer: 2000, // Espera 2 segundos antes de redirigir
                icon: "info",

                focusConfirm: false,
                draggable: true,

            }).then(() => {
                navigate("/login"); // Navega al home ("/") después de cerrar sesión
            });
        }
    }


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

                            {/* 1. ENVOLVEMOS LA IMAGEN EN UN CONTENEDOR NUEVO */}
                            <div className="image-container">
                                <img src={getImageUrl(pelicula.imagen)} alt={pelicula.nombre} />

                                {/* 2. AGREGAMOS LA DESCRIPCIÓN AQUÍ DENTRO */}
                                <div className="overlay-description">
                                    <p>{pelicula.descripcion || "Sin sinopsis disponible."}</p>
                                </div>
                            </div>

                            <div className='pelicula-info'>
                                <h3>{pelicula.nombre}</h3>
                                <p>{pelicula.duracion} - {pelicula.lanzamiento.split('-')[0]}</p>

                                <button
                                    className="btn-comprar"
                                    onClick={() => handleComprarClick(pelicula)}
                                >
                                    Comprar Entrada
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {movieToBuy && (
                    <div className="modal-backdrop-custom">
                        <div className="modal-content-custom">

                            <div className="modal-header">
                                <h2 className="text-warning">{movieToBuy.nombre}</h2>
                                <button className="btn-close-custom" onClick={handleCloseModal}>X</button>
                            </div>

                            <div className="modal-body">
                                <h5 className="mb-3">Selecciona una función:</h5>

                                {funcionesPorPelicula.length > 0 ? (
                                    <div className="funciones-grid">
                                        {funcionesPorPelicula.map((funcion) => (
                                            <div
                                                key={funcion.id}
                                                // 4. CLASE DINÁMICA: Si es la seleccionada, le ponemos borde amarillo
                                                className={`funcion-card ${funcionSeleccionada === funcion.id ? 'selected' : ''}`}
                                                onClick={() => setFuncionSeleccionada(funcion.id)}
                                            >
                                                <div className="funcion-hora">{funcion.hora.slice(0, 5)} hs</div>
                                                <div className="funcion-info">
                                                    <span className="funcion-fecha">{new Date(funcion.fecha).toLocaleDateString()}</span>
                                                    <span className="funcion-sala">{funcion.nombre_sala}</span>
                                                </div>
                                                <div className="funcion-precio">${funcion.precio}</div>
                                            </div>
                                        ))}
                                        {funcionSeleccionada && funcionActual && (
                                            <div className="cantidad-section animate-fade-in">
                                                <hr className="divider" />

                                                <div className="d-flex justify-content-between align-items-center">

                                                    <div className="contador-wrapper">
                                                        <span className="text-muted me-3">Cantidad de entradas:</span>
                                                        <div className="contador-controles">
                                                            <button className="btn-contador" onClick={decrementarCantidad}>-</button>
                                                            <span className="numero-cantidad">{cantidad}</span>
                                                            <button className="btn-contador" onClick={incrementarCantidad}>+</button>
                                                        </div>
                                                    </div>

                                                    <div className="total-precio">
                                                        <small>Total a pagar:</small>
                                                        <div className="precio-gigante">${totalPagar}</div>
                                                    </div>

                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-muted">
                                        <p>Cargando horarios disponibles...</p>
                                        {/* O podrías poner: "No hay funciones disponibles para esta película" */}
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer d-flex justify-content-between align-items-center">

                                <small className="text-muted">
                                    {funcionSeleccionada ? 'Función seleccionada.' : 'Elige un horario para continuar.'}
                                </small>

                                {/* Solo mostramos este botón, que ahora redirige automáticamente */}
                                {funcionSeleccionada && (
                                    <button
                                        className="btn-pagar animate-fade-in"
                                        onClick={handleIrAPagar}
                                    >
                                        Ir a Pagar &rarr;
                                    </button>
                                )}

                            </div>
                        </div>
                    </div>
                )}
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
                            {/* --- SWITCH DE ESTRENO --- */}
                            <div className="form-check form-switch my-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="switchEstreno"
                                    checked={nuevaPelicula.estreno === 1}
                                    onChange={(e) => setNuevaPelicula({
                                        ...nuevaPelicula,
                                        estreno: e.target.checked ? 1 : 0
                                    })}
                                    style={{ cursor: 'pointer' }}
                                />
                                <label className="form-check-label text-white" htmlFor="switchEstreno">
                                    ¿Es Estreno?
                                </label>
                                <div className="form-text text-muted">
                                    Si activas esto, aparecerá en el carrusel principal.
                                </div>
                            </div>

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
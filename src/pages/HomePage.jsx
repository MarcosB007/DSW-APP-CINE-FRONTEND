import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/homePage.css';
import api from '../api/axios.js';

const BACKEND_URL = 'http://localhost:3001';

export const HomePage = () => {
    // 1. CREAR LA REFERENCIA AL CARRUSEL
    const carouselRef = useRef(null);

    const [peliculas, setPeliculas] = useState([]);

    const getImageUrl = (path) => {
        if (!path) return 'https://placehold.co/200x300/222/fff?text=No+Image';
        if (path.startsWith('http')) {
            return path;
        }
        const correctedPath = path.replace(/\\/g, '/').replace(/^\/+/, '');
        return `${BACKEND_URL}/${correctedPath}`;
    };


    // 2. FUNCIÓN DE DESPLAZAMIENTO (SCROLL)
    const scroll = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 250; // Cantidad de píxeles a desplazar

            if (direction === 'left') {
                carouselRef.current.scrollLeft -= scrollAmount;
            } else {
                carouselRef.current.scrollLeft += scrollAmount;
            }
        }
    };

    useEffect(() => {
        // Definimos una función 'async' adentro
        const cargarPeliculas = async () => {
            try {
                const res = await api.get('/getPeliculasPorEstreno');

                setPeliculas(res.data);
            } catch (error) {
                console.error("Error al cargar las películas:", error);
            }
        };

        cargarPeliculas();
    }, []);

    return (
        <div className='app-container'>
            <Header />

            <div className="hero-section">

                <h1 className="hero-title">ESTRENOS DEL MES</h1>
                <div className="carousel-wrapper">

                    <button className="arrow left-arrow" onClick={() => scroll('left')}>
                        &lt;
                    </button>

                    <div className="carousel-container" ref={carouselRef}>

                        <div className="carousel-track">

                            {peliculas.map((pelicula) => (
                                <div key={pelicula.id} className='pelicula-card'>
                                    <img src={getImageUrl(pelicula.imagen)} alt={pelicula.nombre} />
                                    <div className='pelicula-info'>
                                        <h3>{pelicula.nombre}</h3>

                                        <p>{pelicula.duracion} - {pelicula.lanzamiento.split('-')[0]}</p>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

 
                    <button className="arrow right-arrow" onClick={() => scroll('right')}>
                        &gt;
                    </button>

                </div>

            </div>

            <Footer />
        </div>
    );
};
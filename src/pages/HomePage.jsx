import React, { useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/homePage.css';


export const HomePage = () => {
    // 1. CREAR LA REFERENCIA AL CARRUSEL
    const carouselRef = useRef(null);

    // 2. FUNCIÓN DE DESPLAZAMIENTO (SCROLL)
    const scroll = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 350; // Cantidad de píxeles a desplazar

            if (direction === 'left') {
                carouselRef.current.scrollLeft -= scrollAmount;
            } else {
                carouselRef.current.scrollLeft += scrollAmount;
            }
        }
    };

    return (
        <div className='app-container'>
            <Header />
            
            <div className="hero-section">
                
                {/* 2. CONTENIDO PRINCIPAL ENCIMA DEL FONDO OPACO */}
                <h1 className="hero-title">ESTRENOS DEL MES</h1>
                
                {/* ---------------------------------------------------- */}
                {/* NUEVO WRAPPER: Contiene el scroll y las flechas FIJAS */}
                {/* ---------------------------------------------------- */}
                <div className="carousel-wrapper">
                    
                    {/* FLECHA IZQUIERDA (Va afuera del scroll) */}
                    <button className="arrow left-arrow" onClick={() => scroll('left')}>
                        &lt;
                    </button>
                
                    {/* 3. CARRUSEL: Contenedor principal del scroll */}
                    <div className="carousel-container" ref={carouselRef}>
                        
                        <div className="carousel-track">
                            
                            {/* ------------------------------------- */}
                            {/* TARJETAS DE PELÍCULA (Ejemplos) */}
                            {/* ------------------------------------- */}
                            
                            <div className="movie-card">
                                <img src="/images/poster1.jpeg" alt="Zootopia 2" className="movie-poster" />
                                <p className="movie-name">Zootopia 2</p>
                            </div>
                            
                            <div className="movie-card">
                                <img src="/images/poster2.jpg" alt="Deadpool & Wolverine" className="movie-poster" />
                                <p className="movie-name">Deadpool & Wolverine</p>
                            </div>

                            <div className="movie-card">
                                <img src="/images/poster3.jpg" alt="Soy Leyenda" className="movie-poster" />
                                <p className="movie-name">Soy Leyenda</p>
                            </div>
                            
                            <div className="movie-card">
                                <img src="/images/poster4.jpg" alt="Beetlejuice 2" className="movie-poster" />
                                <p className="movie-name">Beetlejuice 2</p>
                            </div>
                            
                            <div className="movie-card">
                                <img src="/images/poster5.jpg" alt="Wicked" className="movie-poster" />
                                <p className="movie-name">Wicked</p>
                            </div>
                            
                            <div className="movie-card">
                                <img src="/images/poster6.jpg" alt="Gladiator 2" className="movie-poster" />
                                <p className="movie-name">Gladiator 2</p>
                            </div>
                            
                            <div className="movie-card">
                                <img src="/images/poster7.jpg" alt="Mufasa" className="movie-poster" />
                                <p className="movie-name">Mufasa</p>
                            </div>
                            
                            <div className="movie-card">
                                <img src="/images/poster7.jpg" alt="Mufasa" className="movie-poster" />
                                <p className="movie-name">Mufasa</p>
                            </div>
                            
                        </div>
                    </div>
                    
                    {/* FLECHA DERECHA (Va afuera del scroll) */}
                    <button className="arrow right-arrow" onClick={() => scroll('right')}>
                        &gt;
                    </button>
                    
                </div>
                {/* FIN DEL WRAPPER */}
                
            </div>
            
            <Footer />
        </div>
    );
};
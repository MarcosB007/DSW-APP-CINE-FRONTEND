import React, { useState } from 'react'

export function ComprarTicketModal() {

    const [movieToBuy, setMovieToBuy] = useState(null);

    return (
        <div className='app-container'>

            {/* ... tu header, hero section, etc ... */}

            <div className='cartelera-grid'>
                {peliculas.map((pelicula) => (
                    <div key={pelicula.id} className='pelicula-card'>
                        <img src={getImageUrl(pelicula.imagen)} alt={pelicula.nombre} />

                        <div className='pelicula-info'>
                            <h3>{pelicula.nombre}</h3>
                            <p>{pelicula.duracion} - {pelicula.lanzamiento.split('-')[0]}</p>

                            {/* 3. BOTÓN DE COMPRAR */}
                            <button
                                className="btn-comprar"
                                onClick={() => setMovieToBuy(pelicula)}
                            >
                                Comprar Entrada
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 4. EL MODAL (Se muestra solo si movieToBuy tiene datos) */}
            {movieToBuy && (
                <div className="modal-backdrop-custom">
                    <div className="modal-content-custom">
                        <div className="modal-header">
                            <h2>Comprar: {movieToBuy.nombre}</h2>
                            <button
                                className="btn-close-custom"
                                onClick={() => setMovieToBuy(null)}
                            >
                                X
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Aquí irá el formulario de compra próximamente...</p>
                            <p>ID de Película: {movieToBuy.id}</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={() => setMovieToBuy(null)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

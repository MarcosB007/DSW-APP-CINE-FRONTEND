import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import MovieCard from './MovieCard'; // <- Importamos el ladrillo

// --- DATOS DE EJEMPLO ---
// Úsalos temporalmente si tu API aún no está lista
// Simplemente descomenta la línea de 'setMovies(sampleMovies)' en el useEffect
const sampleMovies = [
  {id: 1, title: "Dune: Parte Dos", year: 2024, rating: 8.8, genres: ["Ciencia Ficción", "Aventura"], posterUrl: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05ESeaB.jpg"},
  {id: 2, title: "Oppenheimer", year: 2023, rating: 8.6, genres: ["Biografía", "Drama", "Historia"], posterUrl: "https://image.tmdb.org/t/p/w500/8GkiSg1xprbVYcQldQddwNokc0V.jpg"},
  {id: 3, title: "Interestelar", year: 2014, rating: 8.4, genres: ["Aventura", "Drama", "Sci-Fi"], posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"},
  {id: 4, title: "El Origen", year: 2010, rating: 8.3, genres: ["Acción", "Sci-Fi", "Aventura"], posterUrl: "https://image.tmdb.org/t/p/w500/i9tUIOk1gGo4myW22s0R2QWl23o.jpg"}
];
// ------------------------

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // ¡¡CAMBIA ESTA URL POR LA DE TU API!!
        const response = await fetch('http://localhost:4000/api/peliculas'); 
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setMovies(data);
        
        // --- DESCOMENTA ESTO PARA USAR LOS DATOS DE EJEMPLO ---
        // setMovies(sampleMovies); 
        
      } catch (e) {
        setError(e.message);
        console.error("Error al cargar películas:", e);
        
        // Si la API falla, usa los datos de ejemplo como respaldo (opcional)
        // setMovies(sampleMovies); 
        
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []); // El array vacío [] asegura que se ejecute solo una vez

  // --- Renderizado Condicional ---
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="text-white mt-2">Cargando películas...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">
          <strong>Error:</strong> {error}
          <p>No se pudieron cargar las películas desde la API.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="text-white mb-4">Catálogo de Películas</h2>
      
      {/* Grid Responsivo */}
      <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
        {movies.map(movie => (
          <Col key={movie.id}> {/* Asegúrate de que tu API devuelva un 'id' único */}
            <MovieCard movie={movie} /> {/* Usamos el "ladrillo" aquí */}
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default MovieList;
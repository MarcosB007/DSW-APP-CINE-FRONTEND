import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaHeart, FaStar } from 'react-icons/fa';
import '..//styles/movieCard.css'; // Importamos sus estilos

// Recibimos el objeto 'movie' a través de props
const MovieCard = ({ movie }) => {
  
  // Asignamos valores por defecto por si alguna propiedad viene vacía
  const { 
    title = "Título no disponible", 
    posterUrl = "https://via.placeholder.com/400x600?text=Sin+Imagen", // Una imagen genérica
    year = "N/A", 
    rating = 0, 
    genres = [] 
  } = movie;

  return (
    // 'h-100' hace que todas las cards en una fila tengan la misma altura
    <Card className="movie-card h-100">
      
      <div className="card-img-container">
        <Card.Img 
          variant="top" 
          src={posterUrl} 
          alt={`Póster de ${title}`} 
          className="movie-poster" 
        />
        
        <Button variant="link" className="favorite-icon" aria-label="Agregar a favoritos">
          <FaHeart />
        </Button>
        
        <Badge bg="dark" className="rating-badge">
          <FaStar className="star-icon" /> {rating.toFixed(1)}
        </Badge>
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="movie-title">{title}</Card.Title>
        <Card.Text className="text-muted movie-year">{year}</Card.Text>
        
        <div className="genres-container mb-3">
          {genres.slice(0, 3).map((genre, index) => (
            <Badge pill bg="secondary" key={index} className="me-1">
              {genre}
            </Badge>
          ))}
        </div>
        
        <Button variant="primary" className="mt-auto">Ver Detalles</Button>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
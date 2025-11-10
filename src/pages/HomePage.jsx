// src/components/HomePage.js

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/homePage.css'; // Asegúrate de crear y enlazar este archivo
import { useAuth } from '../context/AuthContext'; // ⛔ ¡IMPORTANTE! Importa tu contexto



// Datos de ejemplo iniciales. Más adelante, esto vendrá de tu base de datos.
const peliculasIniciales = [
  {
    id: 1,
    titulo: 'Duna: Parte Dos',
    descripcion: 'Paul Atreides se une a los Fremen y comienza un viaje espiritual y marcial para convertirse en Muad\'Dib.',
    anio: 2024,
    genero: 'Ciencia Ficción',
    imagen: 'https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' // URL de ejemplo
  },
  {
    id: 2,
    titulo: 'Oppenheimer',
    descripcion: 'La historia del científico J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica.',
    anio: 2023,
    genero: 'Drama',
    imagen: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' // URL de ejemplo
  }
];

export const HomePage = () => {
  // --- ESTADOS DEL COMPONENTE ---
  const [peliculas, setPeliculas] = useState(peliculasIniciales);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevaPelicula, setNuevaPelicula] = useState({
    titulo: '',
    descripcion: '',
    anio: '',
    genero: 'Acción', // Valor por defecto
    imagen: null,
  });

  const { isAuthenticated, user } = useAuth();

  // --- MANEJADORES DE EVENTOS ---

  // Maneja los cambios en los inputs del formulario (texto, año, genero)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaPelicula({ ...nuevaPelicula, [name]: value });
  };

  // Maneja el cambio en el input de la imagen
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Creamos una URL temporal para previsualizar la imagen
      const file = e.target.files[0];
      setNuevaPelicula({ ...nuevaPelicula, imagen: URL.createObjectURL(file) });
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí, más adelante, llamarías a tu API para guardar en la BD.
    // Por ahora, solo actualizamos el estado local.
    setPeliculas([...peliculas, { id: Date.now(), ...nuevaPelicula }]);
    
    // Cerramos el modal y reseteamos el formulario
    setIsModalOpen(false);
    setNuevaPelicula({
      titulo: '',
      descripcion: '',
      anio: '',
      genero: 'Acción',
      imagen: null,
    });
  };

  return (
    <div className='app-container'>
      <Header />

      <main className='main-content'>
        <div className='cartelera-header'>
          <h2>Cartelera</h2>
          {/* --- BOTÓN SOLO PARA ADMINS --- */}
          {user?.rol === 'admin' && (
            <button className='btn-agregar' onClick={() => setIsModalOpen(true)}>
              + Agregar Película
            </button>
          )}
        </div>

        {/* --- CONTENEDOR DE LA CARTELERA --- */}
        <div className='cartelera-grid'>
          {peliculas.map((pelicula) => (
            <div key={pelicula.id} className='pelicula-card'>
              <img src={pelicula.imagen} alt={pelicula.titulo} />
              <div className='pelicula-info'>
                <h3>{pelicula.titulo}</h3>
                <p>{pelicula.genero} - {pelicula.anio}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- MODAL PARA AGREGAR PELÍCULA (solo se muestra si isModalOpen es true) --- */}
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <form onSubmit={handleSubmit}>
              <h2>Agregar Nueva Película</h2>
              <button className='modal-close' onClick={() => setIsModalOpen(false)}>X</button>
              
              <input type="text" name="titulo" placeholder="Título" value={nuevaPelicula.titulo} onChange={handleInputChange} required />
              <textarea name="descripcion" placeholder="Descripción" value={nuevaPelicula.descripcion} onChange={handleInputChange} required />
              <input type="number" name="anio" placeholder="Año de lanzamiento" value={nuevaPelicula.anio} onChange={handleInputChange} required />
              
              <select name="genero" value={nuevaPelicula.genero} onChange={handleInputChange}>
                <option value="Acción">Acción</option>
                <option value="Comedia">Comedia</option>
                <option value="Drama">Drama</option>
                <option value="Ciencia Ficción">Ciencia Ficción</option>
                <option value="Terror">Terror</option>
                <option value="Infantil">Infantil</option>
              </select>
              
              <label htmlFor="imagen">Imagen de Portada:</label>
              <input type="file" name="imagen" accept="image/*" onChange={handleImageChange} required />
              
              <button type="submit" className='btn-submit'>Agregar a Cartelera</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
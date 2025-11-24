import t, { useEffect, useState, useCallback } from 'react'
import { Container } from 'react-bootstrap';
import Header from './Header'
import Footer from './Footer'
import api from '../api/axios.js';
import '../styles/listarPeliculas.css';



function ListarPeliculasPage() {
    return (
        <div className='admin-page-wrapper'>
            
            
            <Header />

            <div className='admin-content'>
                <Container>
                    <div className="admin-header-container">
                        <h2 className="admin-title">Gestión de Películas</h2>
                        <button className="btn btn-genero">
                            Genero
                        </button>
                    </div>

                    <div className="table-responsive rounded shadow-sm">
                        <table className="table table-dark-custom table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Género</th>
                                    <th>Estreno</th> {/* Columna 4 */}
                                    <th className="text-end">Acciones</th> {/* Columna 5 */}
                                </tr>
                            </thead>
                            <tbody>
                                {/* FILA 1 */}
                                <tr>
                                    <td>1</td>
                                    <td>Inception</td>
                                    <td>Ciencia Ficción</td>
                                    <td>Si</td> {/* Celda agregada correctamente */}
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-primary me-2">Editar</button>
                                        <button className="btn btn-sm btn-danger">Eliminar</button>
                                    </td>
                                </tr>

                                {/* FILA 2 */}
                                <tr>
                                    <td>2</td>
                                    <td>El Padrino</td>
                                    <td>Drama</td>
                                    <td>No</td> {/* Celda agregada correctamente */}
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-primary me-2">Editar</button>
                                        <button className="btn btn-sm btn-danger">Eliminar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Container>
            </div>

            <Footer />
        </div>
    )
}

export default ListarPeliculasPage;
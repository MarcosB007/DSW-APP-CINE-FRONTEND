import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import api from '../api/axios.js';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

// Estilos inline para igualar tu imagen (Fondo negro, inputs oscuros)
const darkInputStyle = {
    backgroundColor: '#333',
    color: '#fff',
    border: '1px solid #555',
    marginBottom: '1rem'
};

const labelStyle = {
    color: '#ccc',
    marginBottom: '0.5rem',
    display: 'block'
};

function EditarPeliculaPage() {
    const { id } = useParams(); // Obtenemos el ID de la URL
    const navigate = useNavigate();

    const [categorias, setCategorias] = useState([]);
    const [previewImagen, setPreviewImagen] = useState(null);
    
    // Estado del formulario
    const [datos, setDatos] = useState({
        nombre: '',
        descripcion: '',
        duracion: '',
        lanzamiento: '',
        CATEGORIA_id: '',
        estreno: 0, // 0 = No, 1 = Si
        imagen: null // Aquí guardaremos el archivo nuevo si lo cambian
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            // 1. Cargar categorías para el select
            const resCat = await api.get('/categorias');
            setCategorias(resCat.data);

            // 2. Cargar datos de la película actual
            const resPeli = await api.get(`/getPeliculaPorId?id=${id}`);
            const peli = resPeli.data[0]; // Asumiendo que devuelve un array

            if (peli) {
                // Formateamos la fecha para que el input type="date" la acepte (YYYY-MM-DD)
                const fechaFormateada = peli.lanzamiento ? new Date(peli.lanzamiento).toISOString().split('T')[0] : '';

                setDatos({
                    nombre: peli.nombre,
                    descripcion: peli.descripcion,
                    duracion: peli.duracion,
                    lanzamiento: fechaFormateada,
                    CATEGORIA_id: peli.CATEGORIA_id,
                    estreno: peli.estreno, // Esto vendrá como 1 o 0 de la BD
                    imagen: null // Inicialmente null porque no ha subido archivo nuevo
                });
                
                // Guardamos la imagen vieja para mostrarla de preview
                setPreviewImagen(peli.imagen); 
            }
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatos({ ...datos, [name]: value });
    };

    // Manejo especial para el Checkbox de Estreno
    const handleCheckEstreno = (e) => {
        setDatos({ ...datos, estreno: e.target.checked ? 1 : 0 });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setDatos({ ...datos, imagen: file });
            // Crear preview local
            setPreviewImagen(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('nombre', datos.nombre);
        formData.append('descripcion', datos.descripcion);
        formData.append('duracion', datos.duracion);
        formData.append('lanzamiento', datos.lanzamiento);
        formData.append('CATEGORIA_id', datos.CATEGORIA_id);
        formData.append('estreno', datos.estreno);

        // Solo enviamos la imagen si el usuario seleccionó una nueva
        if (datos.imagen) {
            formData.append('imagen', datos.imagen);
        }

        try {
            // Usamos PUT y pasamos el ID en la URL
            await api.put(`/editarPelicula?id=${id}`, formData);
            alert("Película actualizada con éxito");
            navigate('/admin/listar-peliculas'); // Volver a la tabla
        } catch (error) {
            console.error("Error actualizando:", error);
            alert("Error al guardar los cambios");
        }
    };

    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            
            <Container className="py-5"style={{ marginTop: '60px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#111', padding: '2rem', borderRadius: '10px', boxShadow: '0 0 20px rgba(200,0,0,0.2)' }}>
                    
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="text-white">Editar Película</h2>
                        {/* Botón X para cerrar (volver) */}
                        <button onClick={() => navigate('/admin/listar-peliculas')} className="btn btn-sm btn-outline-light">X</button>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <label style={labelStyle}>Nombre</label>
                            <Form.Control type="text" name="nombre" value={datos.nombre} onChange={handleChange} style={darkInputStyle} required />
                        </Form.Group>

                        <Form.Group>
                            <label style={labelStyle}>Descripción</label>
                            <Form.Control as="textarea" rows={3} name="descripcion" value={datos.descripcion} onChange={handleChange} style={darkInputStyle} required />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <label style={labelStyle}>Duración</label>
                                    <Form.Control type="text" name="duracion" value={datos.duracion} onChange={handleChange} style={darkInputStyle} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <label style={labelStyle}>Fecha Lanzamiento</label>
                                    <Form.Control type="date" name="lanzamiento" value={datos.lanzamiento} onChange={handleChange} style={darkInputStyle} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <label style={labelStyle}>Categoría</label>
                                    <Form.Select name="CATEGORIA_id" value={datos.CATEGORIA_id} onChange={handleChange} style={darkInputStyle} required>
                                        <option value="">Seleccionar...</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                {/* AQUÍ ESTÁ LO QUE PEDISTE DEL ESTRENO */}
                                <Form.Group className="mt-4">
                                    <Form.Check 
                                        type="switch"
                                        id="estreno-switch"
                                        label="¿Es Estreno?"
                                        checked={datos.estreno === 1}
                                        onChange={handleCheckEstreno}
                                        style={{ color: '#fff', fontSize: '1.1rem' }}
                                    />
                                    <small className="text-muted">Si activas esto, aparecerá en el carrusel principal.</small>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mt-3">
                            <label style={labelStyle}>Imagen de Portada (Dejar vacío para mantener la actual)</label>
                            <Form.Control type="file" onChange={handleImageChange} style={darkInputStyle} accept="image/*" />
                            
                            {/* Previsualización pequeña */}
                            {previewImagen && (
                                <div className="mt-2">
                                    <img src={previewImagen.startsWith('http') || previewImagen.startsWith('blob') ? previewImagen : `http://localhost:3001/${previewImagen}`} 
                                         alt="Preview" style={{ height: '80px', borderRadius: '5px' }} />
                                </div>
                            )}
                        </Form.Group>

                        <Button type="submit" className="w-100 mt-4" style={{ backgroundColor: '#d00', border: 'none', padding: '10px', fontWeight: 'bold' }}>
                            Guardar Cambios
                        </Button>

                    </Form>
                </div>
            </Container>

            <Footer />
        </div>
    );
}

export default EditarPeliculaPage;
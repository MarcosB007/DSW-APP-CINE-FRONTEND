import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import "../styles/login.css"

function LoginPage() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn, errors: signInErrors, isAuthenticated, user } = useAuth();
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const regex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;

    const onSubmit = handleSubmit(async (data) => {
        const emailValido = regex.test(data.email);
        if (!emailValido) {
            Swal.fire({
                icon: 'error',
                title: 'Login incorrecto',
                text: 'El correo electrónico no es válido',
                background: 'black',
                color: 'white',
                customClass: {
                    container: 'custom-swal-container',
                    title: 'custom-swal-title',
                    content: 'custom-swal-content',
                    confirmButton: 'custom-swal-confirm-button',
                    cancelButton: 'custom-swal-cancel-button',
                },
            });
            return;
        }

        try {
            await signIn(data);
        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        // Solo toma una decisión CUANDO estés autenticado Y el objeto user esté listo
        if (isAuthenticated && user) {

            // Asumiendo que tu backend ahora devuelve { ..., role: "admin" } o { ..., role: "user" }
            // (Si sigues usando ROL_id, cambia 'user.role' por 'user.ROL_id' y "admin" por 2)

            if (user.role === 'admin') {
                navigate('/home'); // El admin va a /admin
            } else {
                navigate('/login');  // Todos los demás (ej. 'user') van a /home
            }
        }
        // Si 'isAuthenticated' es true pero 'user' es null, 
        // este hook no hace nada y espera al siguiente render (cuando 'user' cargue).
    }, [isAuthenticated, user, navigate]);

    return (
        <div className='contenedorTodo'>
            <Header />

            <div className='contenedor1'>
                <div>
                    {Array.isArray(signInErrors) ? (
                        signInErrors.map((error, i) => (
                            <div className='error-usuario' key={i}>
                                {error}
                            </div>
                        ))
                    ) : (
                        <div className='error-usuario'>
                            {signInErrors}
                        </div>
                    )}

                    <h1 className='titulo-lr'>Login</h1>

                    <form onSubmit={onSubmit}>
                        <label htmlFor="email" className='labels'>Correo electrónico ↓</label>
                        {/* Campo de Email */}
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            className='inputs'
                            placeholder='Ej: John@gmail.com'
                            id='email'
                            maxLength={60}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        {errors.email && (
                            <p className='texto-validacion'>El email es obligatorio</p>
                        )}

                        <label htmlFor="password" className='labels'>Contraseña ↓</label>
                        <div className='password-input-container'>
                            {/* Campo de Contraseña */}
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", { required: true, minLength: 4 })}
                                className='inputs'
                                placeholder='Contraseña'
                                id='password'
                                maxLength={30}
                            />
                            {/* Icono de ojo */}
                            {/* <img
                                src={showPassword ? ojoAbierto : ojoCerrado}
                                alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                className='password-toggle-icon'
                                onClick={() => setShowPassword(!showPassword)}
                            /> */}
                        </div>
                        {errors.password && (
                            <p className='texto-validacion'>La contraseña debe ser mayor a 4 caracteres</p>
                        )}

                        <button type="submit" className='boton-login'>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Ingresar
                        </button>
                    </form>

                    <p className='texto-loginR'>
                        No tienes una cuenta para ingresar? <Link to="/register" className='link-login'>Regístrate aquí</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default LoginPage;
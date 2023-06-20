import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import style from './Login.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';


interface LoginFormProps {
  onSubmit: (formData: LoginFormData) => void;
}

export interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async(event: React.FormEvent) => {
    event.preventDefault();
    try {
        console.log(formData.email, formData.password);
        await axios.post('http://localhost:8080/api/auth/login', {
            email: formData.email,
            password: formData.password,
        });
        // Aquí puedes realizar cualquier acción adicional después de enviar el formulario, como redirigir a otra página, mostrar un mensaje de éxito, etc.
      navigate('/');
    } catch (error) {
        console.error(error);
        // Aquí puedes manejar los errores de la solicitud, como mostrar un mensaje de error al usuario.
      }
  };

  return (
    <div className={style.container}>
      <div className={style.formContainer}>
        <h2 className={style.title}>Iniciar sesión</h2>
        <form className={style.loginForm} onSubmit={handleSubmit}>
          <div className={style.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              className={style.inputField}
            />
          </div>
          <div className={style.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className={style.inputField}
            />
          </div>
          <button type="submit" className={style.loginButton}>
            Iniciar sesión
          </button>
        </form>
        <p className={style.signupText}>
          ¿No tienes una cuenta? <Link to="/register"><a >Regístrate</a></Link> 
        </p>
        <p className={style.forgotPasswordText}>
          ¿Olvidaste tu contraseña? <Link to="/forgot-password"><a>Recupérala aquí</a></Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

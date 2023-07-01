import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import style from './Login.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../Context/authContext';


interface LoginFormProps {
  onSubmit: (formData: LoginFormData) => void;
}

export interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const {auth,setAuth} = useAuth();
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
      const response =  await axios.post('http://localhost:8080/api/auth/login', {
            email: formData.email,
            password: formData.password,
        });
    
      if(response && response.data.success){
        toast.success(response.data && response.data.message,{         
          autoClose: 3000,
          closeButton: (
            <button className={style.closeButton}>X</button>
          ),
          });
          setAuth({
            ...auth,
            user: response.data.user,
            token: response.data.token
        })
          localStorage.setItem('auth', JSON.stringify(response.data))
      }else{
        toast.error(response.data.message,{        
          autoClose: 3000,
          closeButton: (
            <button className={style.closeButton}>X</button>
          ),
          });
      }
        // Aquí puedes realizar cualquier acción adicional después de enviar el formulario, como redirigir a otra página, mostrar un mensaje de éxito, etc.
      navigate('/');
    } catch (error) {
        console.error(error);
        // Aquí puedes manejar los errores de la solicitud, como mostrar un mensaje de error al usuario.
        toast.error('Login fallid',{
          autoClose: 3000,
          closeButton: (
            <button className={style.closeButton}>X</button>
          ),        
          });
      }
  };

  return (
    <div className={style.container}>
      <h2>login</h2>
      <form className={style.form} onSubmit={handleSubmit}>
        <input 
          type="email" 
          name='email'
          className={style.email} 
          placeholder="email" 
          value={formData.email}
          onChange={handleChange}/>
        <br />
        <input 
          type="password" 
          name='password'
          className={style.pwd} 
          placeholder="password"  
          value={formData.password}
          onChange={handleChange}/>
           <Link to="/forgot-password">
        <a  className={style.link}>
          forgot your password ?
        </a>
      </Link>    
      <br />     
      <button className={style.register} onClick={() => navigate('/register')}>
        <span>register</span>
      </button>       
      <button className={style.signin} type="submit">
        <span>sign in</span>
      </button>
      </form>
      
    </div>
  );
};

export default Login;

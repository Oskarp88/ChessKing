import React, { useState } from 'react';
import style from './ForgotPassword.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordProps {
  // Propiedades del componente, si las necesitas
}

const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       await axios.post('http://localhost:8080/api/user/forgot-password', { email });

      // Realiza cualquier otra acción necesaria después de enviar el correo electrónico
      setTimeout(()=>{
        toast.success(`Se ha enviado un correo electrónico a ${email} para recuperar la contraseña.`,{
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      },3000);

        navigate('/login');
    } catch (error) {
        toast.error(String(error), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
      // Maneja el error de acuerdo a tus necesidades
    }
  };

  return (
    <div className={style.forgotPasswordContainer}>
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Correo electrónico:
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <button type="submit">Enviar correo</button>
      </form>
    </div>
  );
};

export default ForgotPassword;

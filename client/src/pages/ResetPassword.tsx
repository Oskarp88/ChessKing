import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './ResetPassword.module.css';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ResetPasswordProps {
  // Propiedades del componente, si las necesitas
}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams(); // Extrae el valor del parámetro 'token' de la URL

  useEffect(() => {
    // Realiza cualquier acción necesaria con el valor del token (por ejemplo, mostrarlo en la consola)
    console.log(token);
  }, [token]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('La Contraseña no coinciden',{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      return;
    }

    try {
      // Aquí deberías enviar la solicitud para restablecer la contraseña al servidor
     const response = await axios.post('http://localhost:8080/api/user/reset-password', {
       token: token,
      newPassword: password,
      });

      if(response.data){
        toast.success(response.data.message,{
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }else{
        toast.error(response.data.error,{
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
      // Realiza cualquier otra acción necesaria después de restablecer la contraseña, como redirigir al usuario a una página de inicio de sesión
    } catch (error) {
      // Maneja el error de acuerdo a tus necesidades
      console.error(error);
      toast.error(String(error),{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
  };

  return (
    <div className={style.resetPasswordContainer}>
      <h2>Restablecer contraseña</h2>
      <form className="resetPasswordForm" onSubmit={handleResetPassword}>
        <label>
          Nueva contraseña:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <label>
          Confirmar contraseña:
          <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
        </label>
        <button type="submit">Restablecer contraseña</button>
      </form>
    </div>
  );
};

export default ResetPassword;


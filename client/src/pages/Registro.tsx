import React, { useState } from 'react';
import style from './Registro.module.css';
import axios from 'axios';
import { useChessboardContext } from '../Context/boardContext';



interface RegisterFormProps {
  onSubmit: (formData: RegisterFormData) => void;
}

export interface RegisterFormData {
  name: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
}

const Registro: React.FC<RegisterFormProps> = ({ onSubmit }) => {
    const {boardColor} = useChessboardContext();
    
   

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
  });

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
      await axios.post('http://localhost:8080/api/user', {
        name: formData.name,
        lastName: formData.lastName,
        username: formData.userName,
        email: formData.email,
        password: formData.password,
        country: formData.country
      });
      // Aquí puedes realizar cualquier acción adicional después de enviar el formulario, como mostrar un mensaje de éxito, redirigir a otra página, etc.
    } catch (error) {
      console.error(error);
      // Aquí puedes manejar los errores de la solicitud, como mostrar un mensaje de error al usuario.
    }
  };

  return (
    <form className={style.registerform} onSubmit={handleSubmit}>
      <div style={{ width: '100%' }}>
        <label>
          Nombre:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
      </div>
      <div style={{ width: '100%' }}>
        <label>
          Apellido:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
        </label>
      </div>
      <div style={{ width: '100%' }}>
        <label>
          Nombre de usuario:
          <input type="text" name="userName" value={formData.userName} onChange={handleChange} />
        </label>
      </div>
      <div style={{ width: '100%' }}>
        <label>
          Email:
          <input type="email" style={{ width: '100%' }} name="email" value={formData.email} onChange={handleChange} />
        </label>
      </div>
      <div style={{ width: '100%' }}>
        <label>
          Contraseña:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
      </div>
      <div style={{ width: '100%' }}>
        <label>
          Repetir contraseña:
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </label>
      </div>
      <div style={{ width: '100%' }}>
        <label>
          País:
          <input type="text" name="country" value={formData.country} onChange={handleChange} />
        </label>
      </div>
      <button type="submit" style={{backgroundColor: boardColor.register}}>Registrarse</button>
    </form>
  );
};

export default Registro;
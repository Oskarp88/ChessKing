import React, { useEffect, useState } from 'react';
import style from './Registro.module.css';
import axios from 'axios';
import { useChessboardContext } from '../Context/boardContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



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
    const [countries, setCountries] = useState<any[]>([]);
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('');
   
    const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({
    name: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        setCountries(response.data);
        setFilteredOptions(response.data.map((country: {name: {common: string}}) => country.name.common));
      } catch (error) {
        console.error(error);
      }
    };

    fetchCountries();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const errors: Record<string, string> = {};
  
    if (!formData.name) {
      isValid = false;
      errors.name = 'Name is required';
    }
  
    if (!formData.lastName) {
      isValid = false;
      errors.lastName = 'Last name is required';
    }
  
    if (!formData.userName) {
      isValid = false;
      errors.userName = 'Username is required';
    }
  
    if (!formData.email) {
      isValid = false;
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      isValid = false;
      errors.email = 'Invalid email format';
    }
  
    if (!formData.password) {
      isValid = false;
      errors.password = 'Password is required';
    } else if (formData.password.length < 6 || !/[A-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      isValid = false;
      errors.password = 'Password must be at least 6 characters long and contain at least one uppercase letter and one number';
    }
  
    if (formData.password !== formData.confirmPassword) {
      isValid = false;
      errors.confirmPassword = 'Passwords do not match';
    }
  
    if (!selectedCountry) {
      isValid = false;
      errors.country = 'Country is required';
    } else if (!countries.find((country) => country.name.common === selectedCountry)) {
      isValid = false;
      errors.country = 'Invalid country';
    }
  
    setFormErrors(errors);
    return isValid;
  };
  
  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCountry(event.target.value);
    const { value } = event.target;
  setFormData((prevFormData) => ({
    ...prevFormData,
    country: value,
  }));
  };

  const handleFilterOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered.map((country) => country.name.common));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async(event: React.FormEvent) => {
    event.preventDefault();
    
   if(validateForm()) {
    try {
      
      const response = await axios.post('http://localhost:8080/api/user', {
        name: formData.name,
        lastName: formData.lastName,
        username: formData.userName,
        email: formData.email,
        password: formData.password,
        country: formData.country
      });

      if(response.data.success){
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
          navigate('/login');
      }else{
        toast.error(response.data.message,{
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      }
      // Aquí puedes realizar cualquier acción adicional después de enviar el formulario, como mostrar un mensaje de éxito, redirigir a otra página, etc.
    } catch (error) {
      console.error(error);
      // Aquí puedes manejar los errores de la solicitud, como mostrar un mensaje de error al usuario.
      toast.error(String(error),{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    }
   }
  };

  const countryOptions = countries.map((country) => country.name.common);


  return (
    <div id={style.loginbox}>
    <div className={style.container}>
    <form className={style.letf} onSubmit={handleSubmit}>
      <h1>Sign up</h1>
      <input 
        type="text" 
        name="name" 
        placeholder='Nombre'
        value={formData.name} 
        onChange={handleChange} />
       {formErrors.name && <div className={style.error}>{formErrors.name}</div>}
      <input 
        type="text" 
        name="lastName" 
        placeholder="Apellido" 
        value={formData.lastName} 
        onChange={handleChange} />
       {formErrors.lastName && <div className={style.error}>{formErrors.lastName}</div>}
       <input 
       type="text"
       name="userName" 
       placeholder='Usuario'
       value={formData.userName} 
       onChange={handleChange} />
       {formErrors.userName && <div className={style.error}>{formErrors.userName}</div>}
      <input 
        type="text" 
        name="email" 
        placeholder="E-mail" 
        value={formData.email} 
        onChange={handleChange}
      />
      <input 
        type="password" 
        name="password" 
        placeholder='Password'
        value={formData.password} 
        onChange={handleChange} />
      {formErrors.password && <div className={style.error}>{formErrors.password}</div>}
  
      <input 
        type="password" 
        name="confirmPassword" 
        placeholder='Confirmar password'
        value={formData.confirmPassword} 
        onChange={handleChange} />
        {formErrors.confirmPassword && <div className={style.error}>{formErrors.confirmPassword}</div>}
         <div className={style['country-select']}>
            <input
              type="text"
              name="country"
              value={selectedCountry}
              onChange={handleCountryChange}
              onInput={handleFilterOptions}
              placeholder="Seleccione o escriba un país"
              list="country-options"
            />
            <datalist id="country-options">
              {filteredOptions.map((option) => (
                <option value={option} key={option} />
              ))}
            </datalist>
          </div>    
      <input 
        type="submit" 
        name="signup_submit" 
        value="Sign me up" 
      />
    </form>

    <div className={style.right}>
      <span className={style.loginwith}>Sign in with<br />social network</span>
      <button className={`${style.socialsignin} ${style.facebook}`}>Log in with Facebook</button>
      <button className={`${style.socialsignin} ${style.google}`}>Log in with Google+</button>
    </div>

    <div className={style.or}>OR</div>
    </div>
  </div>
    // <form className={style.registerform} onSubmit={handleSubmit}>
    //   <div style={{ width: '100%' }}>
    //     <label>
    //       Nombre:
    //       <input type="text" name="name" value={formData.name} onChange={handleChange} />
    //       {formErrors.name && <div className={style.error}>{formErrors.name}</div>}
    //     </label>
    //   </div>
    //   <div style={{ width: '100%' }}>
    //     <label>
    //       Apellido:
    //       <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
    //       {formErrors.lastName && <div className={style.error}>{formErrors.lastName}</div>}
    //     </label>
    //   </div>
    //   <div style={{ width: '100%' }}>
    //     <label>
    //       Nombre de usuario:
    //       <input type="text" name="userName" value={formData.userName} onChange={handleChange} />
    //       {formErrors.userName && <div className={style.error}>{formErrors.userName}</div>}
    //     </label>
    //   </div>
    //   <div style={{ width: '100%' }}>
    //     <label>
    //       Email:
    //       <input type="email" style={{ width: '100%' }} name="email" value={formData.email} onChange={handleChange} />
    //       {formErrors.email && <div className={style.error}>{formErrors.email}</div>}
    //     </label>
    //   </div>
    //   <div style={{ width: '100%' }}>
    //     <label>
    //       Contraseña:
    //       <input type="password" name="password" value={formData.password} onChange={handleChange} />
    //       {formErrors.password && <div className={style.error}>{formErrors.password}</div>}
    //     </label>
    //   </div>
    //   <div style={{ width: '100%' }}>
    //     <label>
    //       Repetir contraseña:
    //       <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
    //       {formErrors.confirmPassword && <div className={style.error}>{formErrors.confirmPassword}</div>}
    //     </label>
    //   </div>
      
    //   <div style={{ width: '100%' }}>
    //     <label>
    //       País:
    //       <div className={style['country-select']}>
    //         <input
    //           type="text"
    //           name="country"
    //           value={selectedCountry}
    //           onChange={handleCountryChange}
    //           onInput={handleFilterOptions}
    //           placeholder="Seleccione o escriba un país"
    //           list="country-options"
    //         />
    //         <datalist id="country-options">
    //           {filteredOptions.map((option) => (
    //             <option value={option} key={option} />
    //           ))}
    //         </datalist>
    //       </div>
    //     </label>
    //     {formErrors.country && <div className={style.error}>{formErrors.country}</div>}
    //   </div>
    //   <button type="submit" style={{backgroundColor: boardColor.register}}>Registrarse</button>
    // </form>
  );
};

export default Registro;
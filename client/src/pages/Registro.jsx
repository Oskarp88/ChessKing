import React, { useEffect, useState } from 'react';
import style from './Registro.module.css';
import axios from 'axios';
import  toast  from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChessboardContext } from '../context/boardContext/boardContext';
import { baseUrl } from '../utils/services';
import { useLanguagesContext } from '../context/languagesContext/languagesContext';
import { useAuth } from '../context/authContext/authContext';
import Danger from '../svg/danger';
import { Form } from 'react-bootstrap';

const Registro = () => {
  const {auth} = useAuth();
  const { chessColor } = useChessboardContext();
  const {language} = useLanguagesContext();
  const [countries, setCountries] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [error, setError] = useState(false);
 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    imagenBandera: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
  });

  const {search} = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if(auth?.user){
            navigate(redirect)
        }
    },[navigate, redirect, auth?.user]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        setCountries(response.data);
        setFilteredOptions(response.data.map((country) => country.name.common));
      } catch (error) {
        console.error(error);
      }
    };

    fetchCountries();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!formData.name) {
      isValid = false;
      errors.name = 'Name is required';
    }else if(formData.name.length < 4){
      isValid = false;
      errors.name = 'Minimo 4 caracteres'
    }else if(formData.name.length > 12){
      isValid = false;
      errors.name = 'Maximo 12 caracteres'
    }

    if (!formData.lastName) {
      isValid = false;
      errors.lastName = 'Last name is required';
    }else if(formData.lastName.length < 4){
      isValid = false;
      errors.lastName = 'Minimo 4 caracteres'
    }else if(formData.lastName.length > 12){
      isValid = false;
      errors.lastName = 'Maximo 12 caracteres'
    }

    if (!formData.userName) {
      isValid = false;
      errors.userName = 'Username is required';
    }else if(formData.userName.length > 12){
      isValid = false;
      errors.userName = 'Maximo 12 caracteres'
    }else if(formData.userName.length < 4){
      isValid = false;
      errors.userName = 'Minimo 4 caracteres'
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

  const handleCountryChange = (event) => {
    const { value } = event.target;
    setSelectedCountry(value);
    const selectedCountryData = countries.find((country) => country.name.common === value);
    if (selectedCountryData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        country: value,
        imagenBandera: selectedCountryData.flags.png,
      }));
    }
  };
  

  const handleFilterOptions = (event) => {
    const { value } = event.target;
    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered.map((country) => country.name.common));
  };

  const handleChange = (event) => {
    if(error){
      validateForm();
    }
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(true);
    if (validateForm()) {
      
      try {
        const response = await axios.post(`${baseUrl}/user/register`, {
          name: formData.name,
          lastName: formData.lastName,
          username: formData.userName,
          email: formData.email,
          password: formData.password,
          country: formData.country,
          flags: formData.imagenBandera
        });

        if (response.data.success) {
          toast.success(response.data.message);
          navigate('/login');
        } else {
          toast.error(response.data.message);
        }
        setError(false);
      } catch (error) {
        console.error(error);
        toast.error(`Error in Register: ${error}`);
      }
    }
   
  };


  return (
    <div className={style.Registro} style={{background: chessColor?.fondo}}>
      <div className={style.containerImage}>
        <div id={style.loginbox}>               
          <form className={style.left} onSubmit={handleSubmit}>
            <h1 style={{
              color: chessColor?.titulo,
              fontSize: '1.6rem',
              fontWeight: 700
            }}>
              {language.Sign_up.toUpperCase()}
            </h1>
              <Form.Control
                type="text"
                name="name"
                placeholder={language.name} 
                value={formData.name} 
                onChange={handleChange}
              />
            {formErrors.name &&
            <div className={style.error}>
              <p>
                {formErrors.name}
              </p>
              <div className={style.svg}>
                <Danger/>
              </div>
            </div>
            }
             <Form.Control
                type="text"
                name="lastName"
                placeholder={language.lastName}
                value={formData.lastName}
                onChange={handleChange}
              />
            {formErrors.lastName && 
              <div className={style.error}>
                <p>
                  {formErrors.lastName}
                </p>
                <div className={style.svg}>
                  <Danger/>
                </div>
              </div>
            }
             <Form.Control
                type="text"
                name="userName"
                placeholder={language.username}
                value={formData.userName}
                onChange={handleChange}
              />
            {formErrors.userName && 
              <div className={style.error}>
                <p>
                  {formErrors.userName}
                </p>
                <div className={style.svg}>
                  <Danger/>
                </div>
              </div>
            }
             <Form.Control
                type="email"
                name="email"
                placeholder={language.email}
                value={formData.email}
                onChange={handleChange}
              />
            {formErrors.email && 
              <div className={style.error}>
                <p>
                  {formErrors.email}
                </p>
                <div className={style.svg}>
                  <Danger/>
                </div>
              </div>
            }
             <Form.Control
               type="password"
               name="password"
               placeholder={language.password}
               value={formData.password}
               onChange={handleChange}
              />
            {formErrors.password && 
              <div className={style.error}>
                <p>
                  {formErrors.password}
                </p>
                <div className={style.svg}>
                  <Danger/>
                </div>
              </div>
            }
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder={`${language.confirm} ${language.password}`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {formErrors.confirmPassword && 
              <div className={style.error}>
                <p>
                  {formErrors.confirmPassword}
                </p>
                <div className={style.svg}>
                  <Danger/>
                </div>
              </div>
            }
            <div className={style['country-select']}>
              <Form.Control
                type="text"
                name="country"
                value={selectedCountry}
                onChange={handleCountryChange}
                onInput={handleFilterOptions}
                placeholder={language.Select_or_enter_a_country}
                list="country-options"
              />
              <datalist id="country-options">
                {filteredOptions.map((option) => (
                  <option value={option} key={option} />
                ))}
              </datalist>
            </div>
            {formErrors.country && 
              <div className={style.error}>
                <p>
                  {formErrors.country}
                </p>
                <div className={style.svg}>
                  <Danger/>
                </div>
              </div>
            }
            <input type="submit" name="signup_submit" value={language.sign_me_up} />
          </form>         
        </div>
      </div>
    </div>
  );
};

export default Registro;

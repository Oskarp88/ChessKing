import React, { useEffect, useState } from 'react';
import style from './Register.module.css';
import axios from 'axios';
import  toast  from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../utils/services';
import { useAuth } from '../../context/authContext/authContext';


function Register() {
    const {auth, setAuth} = useAuth()
    const [countries, setCountries] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    console.log('registerGoogle',auth?.user)
    const navigate = useNavigate();
  
    const [formData, setFormData] = useState({
      name: '',
      lastName: '',
      userName: auth?.user?.username || '',
      email: '',
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
        }
    
        if (!formData.lastName) {
          isValid = false;
          errors.lastName = 'Last name is required';
        }
    
        if (!formData.userName) {
          isValid = false;
          errors.userName = 'Username is required';
        }
    
        if (!auth?.user?.country || !auth?.user?.imagenBandera && !selectedCountry) {
          isValid = false;
          errors.country = 'Country is required';
        } else if (!auth?.user?.country || !auth?.user?.imagenBandera && !countries.find((country) => country.name.common === selectedCountry)) {
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
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (validateForm()) {
          try {
            const response = await axios.put(`${baseUrl}/user/update/${auth?.user?._id}`, {
              name: formData.name,
              lastName: formData.lastName,
              username: formData.userName,
              country: formData.country,
              imagenBandera: formData.imagenBandera
            });
    
            if (response.data.success) {
                setAuth({
                    ...auth,
                    user: response.data.userUpdate,
                    token: auth?.token,
                  });
              const data = { user: response.data.userUpdate, token: auth?.token}
              localStorage.setItem('auth', JSON.stringify(data));
              toast.success('registro completado');
              navigate('/');
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            console.error(error);
            toast.error('register fallied');
          }
        }
      };

  return (
    <div className={style.container} >
        <div className={style.row}>
            <h3 >Continue con el registro</h3>
            <form className={style.letf} onSubmit={handleSubmit}>
            <span style={{color: '#277bab', fontWeight:'bold'}}>Nombre</span>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && <div className={style.error}>{formErrors.name}</div>}
            <span style={{color: '#277bab', fontWeight:'bold'}}>Apellido</span>
            <input
              type="text"
              name="lastName"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={handleChange}
            />
            {formErrors.lastName && <div className={style.error}>{formErrors.lastName}</div>}
            <span style={{color: '#277bab', fontWeight:'bold'}}>Usuario</span>
            <input
              type="text"
              name="userName"
              placeholder="Usuario"
              value={formData.userName}
              onChange={handleChange}
            />
            {formErrors.userName && <div className={style.error}>{formErrors.userName}</div>}

            { !auth?.user?.country || !auth?.user?.imagenBandera && <div className={style['country-select']}>
               <span style={{color: '#277bab', fontWeight:'bold'}}>Pais</span>

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
            </div>}
            {formErrors.country && <div className={style.error}>{formErrors.country}</div>}

            <input type="submit" name="signup_submit" value="next" />
          </form>
        </div>
    </div>
  )
}

export default Register;
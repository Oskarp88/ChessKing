import React, { useEffect, useState } from 'react';
import style from './UserProfile.module.css'; // Importa el archivo CSS
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from '@/context/authContext/authContext';
import { useChessboardContext } from '@/context/boardContext/boardContext';
import { useLanguagesContext } from '@/context/languagesContext/languagesContext';
import Danger from '@/svg/danger';
import { baseUrl } from '@/utils/services';
import { avatars } from '@/utils/avatars';
import { marcos } from '@/utils/marcos';

const UserProfile = () => {
  const { auth, setAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    username: '',
    country: '',
  });
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [marco, setMarco] = useState('');
  const [bandera, setBandera] = useState('');
  const [user, setUser] = useState({});
  const [countries, setCountries] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: '',
    lastName: '',
    userName: '',
    country: '',
  });
  const [error, setError] = useState(false)
  const {chessColor} = useChessboardContext();
  const {language} = useLanguagesContext();

  const [showAvatarModal, setShowAvatarModal] = useState(false); 
  const [showMarcoModal, setShowMarcoModal] = useState(false);

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
 
  const handleCountryChange = (event) => {
    const { value } = event.target;
    setSelectedCountry(value);
    const selectedCountryData = countries.find((country) => country.name.common === value);
    if (selectedCountryData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        country: value,
      }));
      setBandera(selectedCountryData.flags.png)
    }
  };
  

  const handleFilterOptions = (event) => {
    const { value } = event.target;
    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered.map((country) => country.name.common));
  };

  const getUser = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/user/${auth.user._id}`);
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: data.name,
      }));
      setFormData((prevFormData) => ({
        ...prevFormData,
        lastName: data.lastName,
      }));
      setEmail(data.email);
      setFormData((prevFormData) => ({
        ...prevFormData,
        username: data.username,
      }));
      setFormData((prevFormData) => ({
        ...prevFormData,
        country: data.country,
      }));
      setSelectedCountry(data.country);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if(formData.name.length < 4){
      isValid = false;
      errors.name = 'Minimo 4 caracteres'
    }else if(formData.name.length > 12){
      isValid = false;
      errors.name = 'Maximo 12 caracteres'
    }

    if (formData.lastName.length < 4){
      isValid = false;
      errors.lastName = 'Minimo 4 caracteres'
    }else if(formData.lastName.length > 12){
      isValid = false;
      errors.lastName = 'Maximo 12 caracteres'
    }

    if(formData.username.length > 12){
      isValid = false;
      errors.userName = 'Maximo 12 caracteres'
    }else if(formData.username.length < 4){
      isValid = false;
      errors.userName = 'Minimo 4 caracteres'
    }

    if (!countries.find((country) => country.name.common === selectedCountry)) {
      isValid = false;
      errors.country = 'Invalid country';
    }

    setFormErrors(errors);
    return isValid;
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
  
  const handleUpdate = async (event) => {
    event.preventDefault();
    setError(true)
    if(validateForm()){
      try {
       
        const response = await axios.put(`${baseUrl}/user/update/${auth.user._id}`, {
           name: formData.name,
           lastName: formData.lastName,
           username: formData.username,
           country: formData.country,
           photo,
           imagenBandera: bandera,
           marco,
        });
        if (response.data.success) {
          toast.success(`${formData.name} is updated`);
          setAuth({
            ...auth,
            user: response.data.userUpdate,
            token: auth?.token,
          });
  
          const data = { user: response.data.userUpdate, token: auth?.token}
          localStorage.setItem('auth', JSON.stringify(data));
          // navigate('/dashboard/user/profile');
        } else {
          toast.error(response.data.message);
        }
        setError(false);
      } catch (error) {
        console.log('error', error);
  
        toast.error(String(error), {
          autoClose: 3000,
          closeButton: <button className={style.closeButton}>X</button>,
        });
      }
    }
  };

  const selectAvatar = (avatar) => {
    setPhoto(avatar);
    setShowAvatarModal(false);
  };

  const selectMarco = (marco) => {
    setMarco(marco);
    setShowMarcoModal(false);
  }

  return (
    <div className={style.container} style={{background: chessColor?.fondo}}>
      <div className={style.userprofile} >
      <div className={style.column}>
        <div className={style.photo} >
          <div className={style.profileimage}>
            {user.photo || user.marco || photo ?
            <div className={style.imageContainer} >
              <img className={style.photoImage} src={photo || user.photo} alt="User Photo" />
              <img className={style.marco} src={marco || user.marco} alt="Marco" height={'200px'}/>
            </div> :
                <>
                <Spinner animation="border" size="sm" />
                <Spinner animation="border" />
                <Spinner animation="grow" size="sm" />
                <Spinner animation="grow" />
              </>
            }
          </div>
          {/* <div className={style.upload}>
            <input 
              type='file' 
              ref={fileRef} 
              hidden accept='image/*'
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className={style.label} onClick={()=>fileRef.current.click()}>
             <div>
             <svg xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '4.5px'}} width="75%" height="75%" fill="currentColor" className="bi bi-camera2" viewBox="0 0 16 16">
                <path d="M5 8c0-1.657 2.343-3 4-3V4a4 4 0 0 0-4 4"/>
                <path d="M12.318 3h2.015C15.253 3 16 3.746 16 4.667v6.666c0 .92-.746 1.667-1.667 1.667h-2.015A5.97 5.97 0 0 1 9 14a5.97 5.97 0 0 1-3.318-1H1.667C.747 13 0 12.254 0 11.333V4.667C0 3.747.746 3 1.667 3H2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1h.682A5.97 5.97 0 0 1 9 2c1.227 0 2.367.368 3.318 1M2 4.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0M14 8A5 5 0 1 0 4 8a5 5 0 0 0 10 0"/>
              </svg>
             </div>
            </div>
          </div> */}
          {/* <div className={style.carga}>
            {fileUploadError ? 
              (<span style={{color: '#d20b0b'}}>
                 {'Error al cargar la imagen (Max. 5mb)' }
              </span>) :
              filePerc > 0 && filePerc < 100 ? 
             ( <ProgressBar className={style.progress} now={filePerc} label={`${filePerc}%`} />) :
              filePerc === 100 ? 
             ( <span style={{color:'#0e8527'}}>
                  Carga exitosa
              </span>) :
             ('')
            }
          </div> */}
          <div
            className={style.avatar}
            // Abre el modal al hacer clic
          >
            <div className={style.avatars}  onClick={() => setShowAvatarModal(true)}>
              <span style={{color: '#0066CC'}}>Avatars</span>
              <img src="/icon/avatar.png" alt="" className={style.imgAvatar}/>
            </div>
            <div className={style.avatars} onClick={() => setShowMarcoModal(true)}>
               <span>Marcos</span>
               <img src="/marcos/marco_001.png" alt="" className={style.imgMarcos}/>
            </div>
          </div>
          
        </div>
      </div>
      <div className={style.column1}>
        <div className={style.inputs}>
          <div className={style.profiledetails}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>{language.name}</Form.Label>
              <Form.Control 
                type="text" 
                placeholder={language.name} 
                name="name" 
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
            </Form.Group>
          
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>{language.lastName}</Form.Label>
              <Form.Control 
                type="text" 
                placeholder={language.lastName} 
                name="lastName" 
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
            </Form.Group >        
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>{language.username}</Form.Label>
              <Form.Control 
                type="text" 
                placeholder={language.username} 
                name="username" 
                value={formData.username} 
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
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>{language.email}</Form.Label>
              <Form.Control 
                disabled 
                type="email" 
                placeholder={language.email} 
                name="email" 
                value={email} 
              />
            </Form.Group>
            <div className={style['country-select']}>
              <label htmlFor="country"> Country</label>
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
            <button className={style.lightbgyellow} onClick={handleUpdate}>Actualizar Perfil</button>
          </div>
        </div>
      </div>
      <AvatarSelectorModal
        show={showAvatarModal}
        handleClose={() => setShowAvatarModal(false)}
        avatars={avatars}
        selectAvatar={selectAvatar}
      />
      <MarcoSelectorModal 
        show={showMarcoModal}
        handleClose={()=> setShowMarcoModal(false)}
        marcos={marcos}
        selectMarco={selectMarco}
      />
      </div>
    </div>
  );
  
};

export default UserProfile;
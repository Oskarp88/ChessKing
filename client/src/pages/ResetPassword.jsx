import React, { useState } from 'react';
import axios from 'axios';
import style from './ResetPassword.module.css';
import { useParams } from 'react-router-dom';
import  toast from 'react-hot-toast';
import { baseUrl } from '../utils/services';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useLanguagesContext } from '../context/languagesContext/languagesContext';
import AlertDismissible from '../components/alerts/AlertDismissible';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState({
     password: '',
     passwordConfirm: '',
     bandera: '',
  });
  const [show, setShow] = useState(false);
  const {language} = useLanguagesContext();
  const { token } = useParams();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (error.bandera === 'caracteres' && password.length > 6 || /[A-Z]/.test(password) || /\d/.test(password)){
      setError(prev => ({
        ...prev, password: '', bandera: '',
      }));
    }
    if(error.bandera === 'vacio'){
      setError(prev => ({
        ...prev, password: '', bandera: '',
      }));
    }
   
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError(prev => ({
      ...prev, passwordConfirm: ''
    }))
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if(!password){
      setError(prev => ({
        ...prev, password: 'Password is require',
        bandera: 'vacio'
      }));
    }else if (password.length < 6 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
       setError(prev => ({
         ...prev, 
         password: 'Password must be at least 6 characters long and contain at least one uppercase letter and one number',
         bandera: 'caracteres'
       }));
    }

    if(!confirmPassword){
      setError(prev => ({
        ...prev, passwordConfirm: 'Confirm Password is require'
      }))
    }

    if(!password || !confirmPassword) return;
     
    if (password !== confirmPassword) {
      toast.error('La Contraseña no coinciden');
      return;
    }

    if(error.bandera) return;

    try {
      const response = await axios.post(`${baseUrl}/user/reset-password`, {
        token: token,
        newPassword: password,
      });

      if (response.data.success) {
        toast.success(`${response.data.message}`);
      } else {      
        setText(`${response.data.message }`);
        setShow(true);
      }
    } catch (error) {
      console.error(error);
      setText(error.response?.data?.message || error.message); 
      setShow(true);   
    }
  };

  return (
    <div className={style.container}> 
      {show && <AlertDismissible title = {'Token'} text={text} show={show} setShow={setShow} variant={'danger'}/>}
       <div className={style.resetPasswordContainer}>
        <h2>{language.reset_password}</h2>
        <Form onSubmit={handleResetPassword}>
        <Form.Group className="mb-3" controlId="formNewPassword">
          <Form.Control 
            type="password" 
            placeholder={language.password}
            value={password} 
            onChange={handlePasswordChange}
          />
        </Form.Group>
        {error.password && <p className={style.error}>{error.password}</p>}
        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Control 
            type="password" 
            placeholder={`${language.confirm} ${language.password}`}
            value={confirmPassword} 
            onChange={handleConfirmPasswordChange} 
          />
        </Form.Group>
        {error.passwordConfirm && <p className={style.error}>{error.passwordConfirm}</p>}
        <Button variant="primary" type="submit">
          {language.Accept}
        </Button>
        </Form>
      </div>    
    </div>
  );
};

export default ResetPassword;

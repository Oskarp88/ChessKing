import React, { useState } from 'react';
import style from './Forgot.module.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../utils/services';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useChessboardContext } from '../context/boardContext/boardContext';
import { useLanguagesContext } from '../context/languagesContext/languagesContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {chessColor} = useChessboardContext();
  const {language} = useLanguagesContext();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {     
     return setError('Email is required')
    } else if (!/\S+@\S+\.\S+/.test(email)) {
     return setError('Invalid email format');
    }



    try {
       await axios.post(`${baseUrl}/user/forgot-password`,{email});

      // Realiza cualquier otra acción necesaria después de enviar el correo electrónico
        toast.success(`Se ha enviado un correo electrónico a ${email} para recuperar la contraseña.`);
        navigate('/login');

    } catch (error) {
        console.log(error)
        toast.error(error.message, 'send failed');
      // Maneja el error de acuerdo a tus necesidades
    }
  };

  return (   
   <div className={style.forgotPasswordContainer}>
     <div className={style.container}>
     <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label style={{fontSize: '2rem', fontWeight: 'bold'}}>
         {language.Email_address}
        </Form.Label>
        <Form.Control type="email" placeholder={language.Enter_email} value={email} onChange={handleEmailChange}/>
        {error && <div className={style.error}>{error}</div>}
        <Form.Text style={{color: chessColor.color1}}>
          {language.We_will_send_you_an_email_to_change_your_password}.
        </Form.Text>
      </Form.Group>

      <Button className='w-100' variant="primary" type="submit">
        {language.send}
      </Button>
    </Form>
     </div>
   </div>
  );
};

export default ForgotPassword;

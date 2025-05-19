import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import style from './Login.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/authContext/authContext';
import  toast from 'react-hot-toast';
import { baseUrl } from '../utils/services';
import { useLanguagesContext } from '../context/languagesContext/languagesContext';
import { useChessboardContext } from '../context/boardContext/boardContext';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Spinner } from 'react-bootstrap';
import logoChess  from '@/assets/logo/logoChess.png';


const Login = () => {
  const [loading, setLoading] = useState(false);
  const {language} = useLanguagesContext();
  const { auth, setAuth } = useAuth();
  const {chessColor} = useChessboardContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const {search} = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if(auth?.user){
            navigate(redirect)
        }
    },[navigate, redirect, auth?.user]);
 
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response && response.data.success) {
        toast.success(response.data && response.data.message);
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });
        setLoading(false);
        localStorage.setItem('auth', JSON.stringify(response.data));
        navigate('/');
      } else {
        setLoading(false);
        toast.error(response.data.message);
      }      
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error('Login failed');
    }
  };

  return (
    <div className={style.backgroundImage} style={{background: chessColor.fondo}}>
      <Container className={style.container}>
        <Row className="d-flex flex-column flex-lg-row">
           <Col className={style.columUno}>
             <img src={logoChess} className={style.logo} alt="" />
             <div className={style.text}>
                <p className='text-center ' style={{color: chessColor.color}}>
                  {language.login_welcome}
                </p>
             </div>
           </Col>
           <Col>
              <div className={style.login} style={{background: chessColor.background_login}}> 
                <Form className={style.form} onSubmit={handleSubmit}>
                  <label style={{ textTransform: 'uppercase' }}>{language.email}</label>
                  <Form.Control 
                    type="email" 
                    name="email"
                    placeholder={language.email}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label style={{ textTransform: 'uppercase' }}>{language.password}</label>
                  <Form.Control 
                    type="password"
                    name="password" 
                    placeholder={language.password} 
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <Link className={style.link} to="/forgot-password">
                    <a >{language.Forgot_your_password}</a>
                  </Link>
                  <Button              
                    type="submit"
                    className='text-uppercase d-flex aling-items-center justify-content-center'
                  >
                    {loading ? 
                      <>
                       <Spinner animation="grow" className={style.sppiner}/>
                       {language.logging_in}...
                      </> 
                      : language.sign_in}
                  </Button>                 
                  <div className={style.customer}>
                        <p className="text-white">
                          {language.New_user} {" "}
                          <Link 
                            to={redirect ? `/register?redirect=${redirect}` : '/register'}
                            className={style.registerLink}
                          >
                            {language.register}
                          </Link>
                        </p>
                    </div>       
                </Form>
              </div>
           </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;

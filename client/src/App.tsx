import './App.css';
import { ChessboardProvider } from './Context/boardContext';
import { CheckMateProvider } from './Context/checkMateContex';
import NavBar from './components/NavBar/NavBar';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Referee from './components/referee/Referee';
import Registro, { RegisterFormData } from './pages/Registro';
import { NotFound } from './pages/pageNotFound';
import { Home } from './pages/Home';
import Login, { LoginFormData } from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const handleRegistroSubmit = (formData: RegisterFormData) => {
    // Aquí puedes realizar las acciones necesarias con los datos del formulario
    // Por ejemplo, enviar los datos al servidor, realizar validaciones, etc.
    console.log(formData); // Ejemplo: mostrar los datos en la consola
  };

  const handleLoginSubmit = (formData: LoginFormData) => {
    // Aquí puedes realizar las acciones necesarias con los datos del formulario
    // Por ejemplo, enviar los datos al servidor, realizar validaciones, etc.
    console.log(formData); // Ejemplo: mostrar los datos en la consola
  };


  return (
    <CheckMateProvider>
      <ChessboardProvider>
        <div id="app">
        <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login onSubmit={handleLoginSubmit} />} />
              <Route path="/register" element={<Registro onSubmit={handleRegistroSubmit} />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword/>} />
              <Route path="/chess" element={<div className="content"><Referee /></div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <NavBar /> 
          <ToastContainer />        
        </div>
      </ChessboardProvider>
    </CheckMateProvider>
  );
}

export default App;

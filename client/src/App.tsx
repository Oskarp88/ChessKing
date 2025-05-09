import './App.css';
import { ChessboardProvider } from './Context/boardContext';
import { CheckMateProvider } from './Context/checkMateContex';
import NavBar from './components/NavBar/NavBar';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Registro, { RegisterFormData } from './pages/Registro';
import { NotFound } from './pages/pageNotFound';
import { Home } from './pages/Home';
import Login, { LoginFormData } from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminRoute from './components/routes/RouteAdmin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllUsers from './pages/admin/Allusers';
import PrivateRoute from './components/routes/PrivateRoute';
import UserProfile from './pages/user/UserProfile';



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
            <NavBar /> 
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login onSubmit={handleLoginSubmit} />} />
              <Route path="/register" element={<Registro onSubmit={handleRegistroSubmit} />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword/>} />
              {/* <Route path="/chess" element={<div className="content"><Referee /></div>} /> */}
              <Route path='/dashboard' element={<AdminRoute/>}>
                <Route path='admin' element={<AdminDashboard/>}/>
                <Route path='admin/users' element={<AllUsers/>}/>
              </Route>
              <Route path='/dashboard' element={<PrivateRoute/>}>
                <Route path='user' element={<UserProfile/>}/>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
         
          <ToastContainer />        
        </div>
      </ChessboardProvider>
    </CheckMateProvider>
  );
}

export default App;

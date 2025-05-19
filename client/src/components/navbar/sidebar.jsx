import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { FaHome, FaUser, FaSignInAlt, FaBars, FaUserPlus, FaGlobe, FaSignOutAlt, FaTimes,  } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { Nav, NavDropdown} from 'react-bootstrap';
// import { useLanguagesContext } from '../../context/languagesContext/languagesContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext/authContext';
import { languages } from '../../utils/languages';
import toast from 'react-hot-toast';
import { colorChess } from '../../utils/Colors';
// import { useChessboardContext } from '../../context/boardContext/boardContext';
import SettingsModal from '../modal/SettingsModal';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(0); 
  // const {chessColor, setChessColor} = useChessboardContext();
  // const {language, setLanguage} = useLanguagesContext();
  const [showModalSettings, setShowSettings] = useState();
  const {auth, setAuth} = useAuth();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);


useEffect(()=>{
  const languageNum = localStorage.getItem('languageNum');
  
  if(!isNaN(languageNum) && languageNum) {
    setLanguage(languages[parseInt(languageNum)]);
  }
 
},[language, setLanguage]);

useEffect(()=>{
  const themeLocal = localStorage.getItem('theme');

  if(!isNaN(themeLocal) && themeLocal) {
    setChessColor(colorChess[parseInt(themeLocal)]);
    setTheme(parseInt(themeLocal));
  }else{
    setChessColor(colorChess[theme]);
  }
},[chessColor, theme, setChessColor]);


  // Verificar si la ruta actual es /chess
  if (location.pathname === "/chess" || location.pathname === "/dashboard/next" || location.pathname === "/chess-play") {
    return null; // No renderiza nada si la ruta es /chess
  }

  const handleMouseEnter = () => {
    setIsOpen(true); // Expande el sidebar
  };

  const handleMouseLeave = () => {
    setIsOpen(false); // Contrae el sidebar
  };

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === 0 ? 1 : 0));
    localStorage.setItem('theme', theme === 0 ? 1 : 0);
  };

  const handleLogout = () => {
  setAuth({
    ...auth,
    user: null,
    token: ''
  });

  localStorage.removeItem('auth');
  toast.success('Logout succefilly');
  navigate('/login');
  }

  const handleLanguageChange = (num) => {
  setLanguage(languages[num]);
  localStorage.setItem('languageNum', num)
  }

  const firstName = (auth?.user?.name || "").charAt(0).toUpperCase() + (auth?.user?.name || "").slice(1);
  const trimmedFirstName = firstName.substring(0, 8);

  const lastName = (auth?.user?.lastName || "").charAt(0).toUpperCase() + (auth?.user?.lastName || "").slice(1);
  const trimmedLastName = lastName.substring(0, 8);


  return (
    <> 
      <div
        className={`sidebar ${isOpen ? 'mobile-open' : ''} fixed-top`}
        onMouseEnter={windowWidth > 768 ? handleMouseEnter : undefined}  // Expande cuando el mouse está sobre el sidebar
        onMouseLeave={handleMouseLeave}  // Contrae cuando el mouse sale del sidebar
        style={{background: chessColor.navbar}}
      >
        <div className={`sidebar-icon ${isOpen ? '':'iconTop'}`} onClick={()=>setIsOpen(!isOpen)}>
          {
            !isOpen ? 
            <FaBars className='bars'/> :
            <FaTimes className='fatimes' />
          }
        </div>
        <div className="menu">
          <Nav.Link href="/" className={`${isOpen ? 'menu-item-open' : 'menu-item'}`}>
            <FaHome className="icon" />
            <span className="text">{language?.home}</span>
          </Nav.Link>
          {
            auth?.user ? 
            <Nav.Link href="/dashboard/profile" className={`${isOpen ? 'menu-item-open' : 'menu-item'}`}>
            <FaUser className="icon" />
            <span className="text">{language?.profile}</span>
          </Nav.Link>  :
             <>
               <Nav.Link href="/login" className={`${isOpen ? 'menu-item-open' : 'menu-item'}`}>
                  <FaSignInAlt className="icon" />
                  <span className="text">{language?.login}</span>
                </Nav.Link>
                <Nav.Link href="/register" className={`${isOpen ? 'menu-item-open' : 'menu-item'}`}>
                  <FaUserPlus className='icon'/>
                  <span className='text'>{language?.register}</span>
                </Nav.Link>
             </>
          }
          
          <div 
            className={`${isOpen ? 'menu-item-open' : 'menu-item'}`}
            onClick={handleThemeToggle} 
          >
              {
                theme === 0 ? 
                <svg xmlns="http://www.w3.org/2000/svg"  width='30'  height='30'  fill="currentColor" className="bi bi-brightness-high-fill" viewBox="0 0 16 16">
                  <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
                </svg> :
                <svg xmlns="http://www.w3.org/2000/svg"  width='30'  height='30' fill="currentColor" className="bi bi-moon-stars-fill" viewBox="0 0 16 16">
                  <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
                  <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
                </svg>
              }
                <span className='text'>{theme === 0 ? 'Light' : 'Dark'}</span>
          </div>
          <div className={`${isOpen ? 'menu-item-open' : 'menu-item'}`}>
            <FaGlobe className='icon'/>
            <NavDropdown                   
              title={                
                  <span >{language?.Language}</span>            
              }
             
              className={`text ${theme === 0 ? 'menu-dropdown' : 'menu-dropdown-dark'}`}
              // style={{background: chessColor?.navbar}}
            >
               <NavDropdown.Item 
                 className='text item'  
                 onClick={() => handleLanguageChange(1)}
                 style={{fontWeight: 600}}
              >
                  {language.english}
                </NavDropdown.Item>
                <NavDropdown.Item 
                className='text item'  
                onClick={() => handleLanguageChange(0)}
                style={{fontWeight: 600}}
                >
                  {language.spanish}
                </NavDropdown.Item>
            </NavDropdown>
          </div>
          {
            auth?.user && 
            <>
               <div 
                className={`${isOpen ? 'menu-item-open' : 'menu-item'}`}
                onClick={()=>setShowSettings(true)}
              >
                <FiSettings className='icon'/>
                <span className='text'>{language?.settings}</span>
              </div>
              <Nav.Link className={`${isOpen ? 'menu-item-open' : 'menu-item'}`}  onClick={handleLogout}>
                <FaSignOutAlt className='icon'/>
                <span className='text'>{language?.logout}</span>
              </Nav.Link>
            </>
          }
        </div>        
        <div className='containerLogo' >
        <Nav.Link href="/" className='logoContainer' >
          <img src="/logo/chessfive.png" alt="" className={`${isOpen ? 'logo' : 'logoClose'}`}/>
        </Nav.Link>

        { auth?.user && 
          <div className='containerPhoto'
            style={isOpen ? {width: '97%', borderRadius: '2rem 2rem 1rem 1rem '}: {width: '91.5%'}}
          >
            <div className='userprofile' >           
              <div className='imageContainer'>
                <img className='photo' src={auth?.user?.photo} alt="User Photo" />
                <img className='marco' src={auth?.user?.marco} alt="Marco" />
              </div>
            </div>
            <span className='text'>{`${trimmedFirstName} ${trimmedLastName}`}</span>
          </div>
        }
        </div>
      </div>
      <SettingsModal 
        show={showModalSettings}
        handleClose={()=> setShowSettings(false)}
      />
    </>
  );
};

export default Sidebar;



import React, { useEffect, useRef, useState } from 'react';
import style from './RankingTablaBullet.module.css';
import { useAuth } from '@/context/authContext/authContext';
import { useLanguagesContext } from '@/context/languagesContext/languagesContext';
import useRanking from '@/hooks/useRanking';
import { baseUrl, getRequest } from '@/utils/services';
import SpinnerDowloand from '../spinner/SpinnerDowloand';
import { medals } from '@/Constants';
import { Spinner } from 'react-bootstrap';
import ModalProfile from '../channel/modal/ModalProfile';

export const RankingTableBullet = () => {
  const {auth} = useAuth();
  const [user, setUser] = useState({});
  const [elo, setElo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState('');
  const {language} = useLanguagesContext();
  const itemContainerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const userPositionRef = useRef(null); 
  const { rankingData, loading, error } = useRanking('bullet');
  
  useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        // Cambia el estado según la visibilidad
        setIsVisible(entry.isIntersecting);
    });
  
    const currentRef = userPositionRef.current; // Guarda el valor actual de la referencia
    if (currentRef) {
      observer.observe(currentRef);
    }
    // Limpieza al desmontar
    return () => {
        if (currentRef) {
            observer.unobserve(currentRef); // Deja de observar al desmontar
        }
    };
  }, [rankingData]);

  useEffect(() => {
    const getUsersElo = async() =>{
       
        if(auth?.user){
          const response = await getRequest(`${baseUrl}/users/${auth?.user?._id}/elo`);
        
           if(response.error){
              return console.log('Error fetching users', response);
           }
            setElo( response.eloBullet)
        }
     }
  
    getUsersElo();
  },[auth]);

  const handleModalOpen = async(userId) => {
    const response = await getRequest(`${baseUrl}/user/${userId}`);
    if(response.error){
       return console.log('Error fetching users', response);
    }

    setUser(response);
    setPhoto(userId);
    setShowModal(true);
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

   let count = 0;
   let userPosition = null; 
  return (
    <div className={style.tercerdiv} >
       <div className={style.title}>            
            <div className={style.icon}>
              <svg style={{ color: '#F9A825' }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16">
                  <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.6 3.6 0 0 0-.108-.563 2 2 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2 2 0 0 0-.16-.045 4 4 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.55 2.55 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361s.437 1.732-.36 2.531Z"/>
                  <path d="M5.205 10.787a7.6 7.6 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925"/>
              </svg>
            </div>
            <h4>{`${language?.rating} ${language?.bullet}`}</h4>
       </div>             
        <li className={style.item}>
          <span>{language?.Range?.toUpperCase()}</span>
          <div className={style.friendName}>
            <span >{language?.name?.toUpperCase()}</span>
          </div>
          <span >{language?.Score?.toUpperCase()}</span>
        </li>
        <div className={style.itemContainer} ref={itemContainerRef}>
        {error ?
          <div style={{marginTop: '30%'}}>
            <span style={{color: '#6e2c00'}}> {error}</span>
          </div> :
          loading ? 
          <div style={{marginTop: '30%'}}>
            <SpinnerDowloand text={'Cargando rating....'}/>
          </div>
        : rankingData && rankingData.lenght === 0 ?
            <div style={{marginTop: '30%'}}>
            <SpinnerDowloand text={'Cargando rating....'}/>
          </div>
         :rankingData && rankingData.map((o, index) => {
            if (auth?.user && o?._id === auth?.user?._id) {
              userPosition = count;
            }
            return(        
               <li 
                key={index} 
                ref={auth?.user && o?._id === auth?.user?._id ? userPositionRef : null} // Asigna el ref solo a tu posición
                className={auth?.user && o?._id === auth?.user?._id ? ` ${style.frienditem} ${style.viewport}` : `${style.frienditem}`}              
                 title={o?.username}
                 onClick={() => handleModalOpen(o?._id)}
              > 
                <div className={style.colRango}>
                  <span className={style.rango}>
                    {(count++) + 1}.
                    {count <= medals.length 
                      && <img 
                          className={style.medallaIcon} 
                          src={medals[count - 1]} 
                          alt={`Medal for position ${count - 1}`} 
                        />
                    }    
                  </span>
                </div>
                <div className={style.ColMedium}>
                  <div className={style.name}>
                    <div className={style.imageContainer}>
                      <img className={style.photo} src={o?.photo} alt={o?.username || "User"} />
                      <img className={style.marco} src={o?.marco} alt="Decorative frame" />
                    </div>                  
                    <div className={style.column}>
                      <span>{o?.username}</span>
                      <div className={style.containerInsignias}>
                          <img src={o?.imagenBandera} className={style.bandera} alt="" />
                        </div>
                    </div>
                  </div>
                </div>
                <div className={style.friendRank}>
                    <div className={style.icon}>
                      <svg style={{ color: '#F9A825' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16">
                        <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.6 3.6 0 0 0-.108-.563 2 2 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2 2 0 0 0-.16-.045 4 4 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.55 2.55 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361s.437 1.732-.36 2.531Z"/>
                        <path d="M5.205 10.787a7.6 7.6 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925"/>
                      </svg>
                    </div>
                    <span className={style.puntuacion}>
                      {o?.eloBullet}
                    </span>
                </div>
              </li>          
           )})
        }
      </div>
      {!isVisible && auth?.user && <li  
        className={`${style.itemUser}`}              
        title={auth?.user?.username}
        onClick={() => handleModalOpen(auth?.user?._id)}
      > 
            <div className={style.colRango}>
              <span className={style.rango}>
                {userPosition +1}.
                  {userPosition +1 <= medals.length 
                    && <img 
                      className={style.medallaIcon} 
                      src={medals[userPosition]} 
                      alt={`Medal for position ${userPosition}`} 
                    />
                  }     
              </span>
            </div>
            <div className={style.ColMedium}>
              <div className={style.name}>
                <div className={style.imageContainer}>
                  <img className={style.photo} src={auth?.user?.photo} alt={auth?.user?.username || "User"} />
                  <img className={style.marco} src={auth?.user?.marco} alt="Decorative frame" />
                </div>                  
                <div className={style.column}>
                  <span>{auth?.user?.username}</span>
                  <div className={style.containerInsignias}>
                    <img src={auth?.user?.imagenBandera} className={style.bandera} alt="" />
                  </div>
                </div>
              </div>
            </div>
        <div className={style.friendRank}>
            <div className={style.icon}>
              <svg style={{ color: '#F9A825' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16">
                <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.6 3.6 0 0 0-.108-.563 2 2 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2 2 0 0 0-.16-.045 4 4 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.55 2.55 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361s.437 1.732-.36 2.531Z"/>
                <path d="M5.205 10.787a7.6 7.6 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925"/>
              </svg>
            </div>
            <span className={style.puntuacion}>
                {elo ? elo : <Spinner animation="grow" /> }
            </span>
        </div>
      </li>}
      { 
        showModal && 
          <ModalProfile 
            user={user}
            nivel={'bullet'}
            handleModalClose={handleModalClose}
            racha={user.rachaBullet}
            photo={photo}
            elo={user.eloBullet}
            games={user.gamesBullet}
            gamesWon={user.gamesWonBullet}
            gamesTied={user.gamesTiedBullet}
            gamesLost={user.gamesLostBullet}
          /> 
      } 
    </div>
  );
};



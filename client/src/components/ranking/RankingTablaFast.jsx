import React, { useEffect, useRef, useState } from 'react';
import style from './RankingTablaFast.module.css';
import { useAuth } from '@/context/authContext/authContext';
import { useLanguagesContext } from '@/context/languagesContext/languagesContext';
import useRanking from '@/hooks/useRanking';
import { baseUrl, getRequest } from '@/utils/services';
import { FastSvg } from '@/svg';
import SpinnerDowloand from '../spinner/SpinnerDowloand';
import { medals } from '@/Constants';
import { Spinner } from 'react-bootstrap';
import ModalProfile from '../channel/modal/ModalProfile';

export const RankingTable = () => {
  const  {auth} = useAuth();
  const {language} = useLanguagesContext();
  const [elo, setElo] = useState(null);
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [photo, setPhoto] = useState('');
  const { rankingData , loading, error } = useRanking('fast');

  console.log('rankingData',rankingData);

  const userPositionRef = useRef(null); // Create a ref to track the user position
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });
  
    const currentRef = userPositionRef.current; 
  
    if (currentRef) {
      observer.observe(currentRef);
    }
  
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
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
            setElo( response.eloFast)
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
    <div className={style.tercerdiv}>
       <div className={style.title}>            
            <div className={style.icon}>
              <FastSvg />
            </div>
            <h4>{`${language.rating} ${language.fast}`}</h4>
       </div> 
        <li className={style.item}>
          <span>{language.Range?.toUpperCase()}</span>
          <div className={style.friendName}>
            <span >{language.name?.toUpperCase()}</span>
          </div>
          <span >{language.Score?.toUpperCase()}</span>
        </li>   
        <div className={style.itemContainer}>      
        {
        error 
        ? <div style={{marginTop: '30%'}}>
            <span style={{color: '#004d40'}}> {error}</span>
          </div> 
        :  loading 
           ?  <div style={{marginTop: '30%'}}>
                <SpinnerDowloand text={'Cargando rating....'}/>
              </div>
            : rankingData && rankingData.lenght === 0
              ? <div style={{marginTop: '30%'}}>
                  <SpinnerDowloand text={'Cargando rating....'}/>
                </div>
              : rankingData?.map((o, index) => {
                  if (auth?.user && o._id === auth.user._id) {
                    userPosition = count;
                  }
                    return(      
                      <li 
                        ref={auth?.user && o?._id === auth?.user?._id ? userPositionRef : null}
                        key={index} 
                        className={auth?.user && o?._id === auth?.user?._id ? ` ${style.frienditem} ${style.viewport}` : `${style.frienditem}`}                           
                        onClick={() => handleModalOpen(o?._id)}
                        title={o?.username}
                      >
                          <div className={style.colRango}>
                            <span className={style.rango}>
                              {(count++)+1}.                 
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
                                  <img className={style.photo} src={o?.photo} alt={o?.username || 'User'} />
                                  <img className={style.marco} src={o?.marco} alt="Decorative frame" />
                                </div>                                    
                              <div className={style.column}>
                                <span>
                                  {o?.username}
                                </span>
                                <div className={style.containerInsignias}>
                                  <img src={o?.imagenBandera} className={style.bandera} alt="" />
                                </div>
                              </div>
                            </div>
                          </div>
                        
                        <div className={style.friendRank}>
                          <div className={style.icon}>
                            <FastSvg />
                          </div>
                          <span className={style.puntuacion}>
                            {o?.eloFast}
                          </span>
                        </div>
                      </li>         
                  )
                }) 
               }
        </div>
      {!isVisible && auth?.user && <li  
                className={`${style.itemUser}`}              
                title={auth?.user?.username}
                onClick={() => handleModalOpen(auth?.user?._id)}
              > 
                    <div className={style.colRango}>
                      <span className={style.rango}>
                        {userPosition+1}.
                        {userPosition+1 <= medals.length 
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
                          <img className={style.photo} src={auth?.user?.photo} alt={auth?.user?.username || 'User'} />
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
                    <FastSvg/>
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
            nivel={'fast'}
            handleModalClose={handleModalClose}
            racha={user.rachaFast}
            photo={photo}
            elo={user.eloFast}
            games={user.gamesFast}
            gamesWon={user.gamesWonFast}
            gamesTied={user.gamesTiedFast}
            gamesLost={user.gamesLostFast}
          /> 
      }                   
    </div>
  );
};



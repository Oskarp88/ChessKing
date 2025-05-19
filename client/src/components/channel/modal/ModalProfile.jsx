import React, { useState } from 'react';
import style from './ModalProfile.module.css';
import { Spinner } from 'react-bootstrap';
import { BlitzSvg, BulletSvg, FastSvg, LostSvg, WonSvg } from '@/svg';
import { baseUrl, getRequest } from '@/utils/services';
import TiedSvg from '@/svg/tiedSvg';

function ModalProfile({
    handleModalClose, 
    photo, 
    user,
    racha, 
    nivel, 
    elo, 
    games, 
    gamesWon, 
    gamesTied, 
    gamesLost}) {
    const [partida, setPartidas] = useState([]);
    const [modal, setModal] = useState(false);

    const allPartidas = async(userId) => {
        const response = await getRequest(`${baseUrl}/partida/user/historial/${userId}`);
        if(response.error){
           return console.log('Error fetching users', response);
        }

        console.log('partidas',response.partida)
        setPartidas(response.partida);
        setModal(true);
    }
 
    return (
    <div className={style.overlay}>
        <div className={style.gameOverModal}>
        <div className={style.header}>
            <div className={style.containerMoneda}>
                
                    <img src="/icon/moneda.png" alt="" />
                    <div className={style.dinero}>
                    {user?.score
                        ?  
                        <span>{user?.score}</span>
                        :
                        <div className='text-white'>
                            <Spinner animation="grow" size="sm" />
                            <Spinner animation="grow" />
                        </div>
                    }
                    </div>
               
            </div>
            <div>
                <a  className={style.close} onClick={() => handleModalClose()}>
                    <svg style={{marginBottom :'10px'}} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16" >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                    </svg>
                </a>
            </div>
        </div>
        {!modal ?
          <>
              <div className={style.userprofile}>
                {photo ?
                    <div className={style.imageContainerModal} >
                        <img className={style.photoImage} src={user?.photo} alt="User Photo" />                  
                        <img className={style.marco} src={user?.marco} alt="Marco"/>
                    </div>  
                    : <img className={style.profileSidebar} src={'assets/avatar/user.png'} alt='' /> 
                }
            
                    <div className={style.username}>
                        <span>{user.username}</span>
                    </div>
                </div>

            <img className={style.bandera} src={user.imagenBandera} alt={`${user?.country} flag`} />
            <span style={{ color: 'white', fontWeight: 'bold' }}> 
                {user.country}
            </span>     
            <div className={style.area}>
                <span>Nivel</span>
                {nivel === 'fast' ? 
                     <div style={{width: '20px' , height: '20px', marginLeft: '5px', marginTop: '-2px'}}>
                        <FastSvg/>
                     </div>
                    : nivel === 'blitz' ? 
                    <svg style={{ color: '#FFEB3B', marginLeft: '10px', marginTop: '5px' }} xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-lightning-charge-fill" viewBox="0 0 16 16">
                        <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                    </svg> : 
                     <svg style={{ color: '#F9A825', marginLeft: '10px',  marginTop: '5px' }} xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16">
                     <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.6 3.6 0 0 0-.108-.563 2 2 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2 2 0 0 0-.16-.045 4 4 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.55 2.55 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361s.437 1.732-.36 2.531Z"/>
                         <path d="M5.205 10.787a7.6 7.6 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925"/>
                     </svg>
                }
            </div>
            <div className={style.subArea}>         
                <span >{elo}</span>            
            </div>
            <div className={style.area}>
                <span>Racha ganadora</span>
            </div>
            <div className={style.subArea}>         
                <span >{racha}</span>            
            </div>
            <div className={style.area}>
                <span>Total de partidas {nivel}</span>
            </div>
            <div className={style.subArea}>         
                <span >{games}</span>            
            </div>
            <div className={style.area}>
                <span>Partidas ganadas</span>
            </div>
            <div className={style.subArea}>         
                <span >{gamesWon}</span>            
            </div>
            <div className={style.area}>
                <span>Partidas empatadas</span>
            </div>
            <div className={style.subArea}>         
                <span >{gamesTied}</span>            
            </div>
            <div className={style.area}>
                <span>Partidas perdidas</span>
            </div>
            <div className={style.subArea}>         
                <span >{gamesLost}</span>            
            </div>
            <div className={style.historial}>
                <button onClick={() => allPartidas(user?._id)}>
                    <img src="/icon/carpeta.png" alt="" />
                    <p>Historial partidas</p>
                </button>
            </div>
          </>  : 
          <div className={style.scrollableContainer}>
              <h3> Partidas totales ({user?.games})</h3>
              <span>Ultimas partidas de {user?.username}</span>
              <div className={style.scrollableContent}>
              {partida?.slice(0, 15).reverse().map((p, index)=> (
              <>
                <div key={index}>
                   <div className={style.containerpartida}>
                      <div className={style.gameType}>
                         <div>
                         {p?.gameType === 'bullet' ? 
                            <BulletSvg /> :
                          p?.gameType === 'blitz' ? 
                            <BlitzSvg /> :
                            <FastSvg />
                          }
                         </div>
                          <span>
                            {p?.gameType === 'bullet' ? 'Bullet' : 
                             p?.gameType === 'blitz' ? 'Blizt' : 'Fast'}
                          </span>
                      </div>
                      <div>
                         {
                          p?.player?.color === 'white' ?
                             <div className={style.datos}> 
                               <p> {p?.player?.name}({p?.player?.elo})</p>
                               <img  src={p?.player?.bandera} alt={`${p?.player?.country} flag`} />  
                             </div>
                                 :
                            <div className={style.datos}>
                                <p> {p?.nameOpponent?.name}({p?.nameOpponent?.elo})</p>
                                <img  src={p?.nameOpponent?.bandera} alt={`${p?.nameOpponent?.country} flag`} />
                            </div>                        
                         }
                         {
                           p?.player?.color === 'black' ?
                           <div className={style.datos}> 
                             <p> {p?.player?.name}({p?.player?.elo})</p>
                             <img  src={p?.player?.bandera} alt={`${p?.player?.country} flag`} />  
                           </div>
                               :
                          <div className={style.datos}>
                              <p> {p?.nameOpponent?.name}({p?.nameOpponent?.elo})</p>
                              <img  src={p?.nameOpponent?.bandera} alt={`${p?.nameOpponent?.country} flag`} />
                          </div>  
                         }
                      </div>
                      <div className={style.result}>
                        <div className={style.valors}>
                            <p>{p?.player?.color === 'white' ? 
                                  p?.player?.estado === 'won' ? '1' : 
                                  p?.player?.estado === 'lost' ? '0' : '1/2' :
                                  p?.nameOpponent?.estado === 'won' ? '1' :
                                  p?.nameOpponent?.estado === 'lost' ? '0' : '1/2'
                               }
                            </p>
                            <p>{p?.player?.color === 'black' ? 
                                  p?.player?.estado === 'won' ? '1' : 
                                  p?.player?.estado === 'lost' ? '0' : '1/2' :
                                  p?.nameOpponent?.estado === 'won' ? '1' :
                                  p?.nameOpponent?.estado === 'lost' ? '0' : '1/2'
                               }
                            </p>
                        </div>
                        <div className={style.estado}>
                           {
                            p?.player?.estado === 'won' ? <WonSvg/> :
                            p?.player?.estado === 'lost' ? <LostSvg/> : <TiedSvg/>
                            }
                        </div>
                      </div>
                      
                   </div>
                </div>
              </>))}
              </div>
          </div>
        }
       
        </div>
  </div>
  )
}

export default ModalProfile
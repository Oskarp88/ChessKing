import React, { useEffect, useState } from 'react';
import style from '../../pages/home/Home.module.css';
import { useChessboardContext } from '../../context/boardContext/boardContext';
import { useAuth } from '../../context/authContext/authContext';
import { baseUrl, getRequest } from '../../utils/services';
import TiedSvg from '../../svg/tiedSvg';
import { useLanguagesContext } from '../../context/languagesContext/languagesContext';
import BulletSvg from '../../svg/bulletSvg';
import BlitzSvg from '../../svg/blitzSvg';
import WonSvg from '../../svg/wonSvg';
import LostSvg from '../../svg/lostSvg';
import { FastSvg } from '@/svg';

function HistoryGames() {
    const {auth, user} = useAuth();
    const {chessColor} = useChessboardContext();
    const [partida, setPartidas] = useState([]);
    const {language} = useLanguagesContext();

    useEffect(() => {
        const allPartidas = async() => {
          const response = await getRequest(`${baseUrl}/partida/user/historial/${auth?.user?._id}`);
          if(response.error){
            return console.log('Error fetching historial partidas', response);
          }
          setPartidas(response.partida);
        }
        allPartidas()
     },[auth?.user?._id]);

  return (
    <div className={style.scrollableContainer}>
    <h3>
      {language?.game_history.toUpperCase()}
    </h3>
    <div>
        <h6 style={{color: chessColor?.color}}> 
          {language?.total_games} ({user?.games})
        </h6>
        <span style={{color: chessColor?.color}}>
          {language?.Last_games_of} {user?.username}
        </span>
        <div className={style.scrollableContent}>
          { partida.length > 0 ?
          partida?.slice().reverse().slice(0,15).map((p, index)=> (
            <>
              <div key={index}>
                <div className={style.containerpartida}>
                    <div className={style.gameType}>
                      <div>
                        {
                          p?.gameType === 'bullet' ? 
                            <BulletSvg /> :
                          p?.gameType === 'blitz' ? 
                            <BlitzSvg /> :
                            <FastSvg />
                            
                            }
                      </div>
                        {
                          
                            p?.gameType === 'bullet' ? 
                               <span style={{color: '#dc7633'}}>Bullet  </span> : 
                            p?.gameType === 'blitz' ? 
                               <span style={{color: '#f1c40f '}}>Blizt</span> : 
                               <span style={{color: chessColor?.fast}}>Fast</span>
                          
                       }
                    </div>
                    <div>
                      {
                        p?.player?.color === 'white' ?
                          <div className={style.datos}> 
                            <span> {p?.player?.name}({p?.player?.elo})</span>
                            <img  
                              src={p?.player?.bandera} 
                              alt={`${p?.player?.country} flag`} 
                            />  
                          </div>
                              :
                          <div className={style.datos}>
                              <span> {p?.nameOpponent?.name}({p?.nameOpponent?.elo})</span>
                              <img  
                                src={p?.nameOpponent?.bandera} 
                                alt={`${p?.nameOpponent?.country} flag`} 
                              />
                          </div>                        
                        }
                        {
                          p?.player?.color === 'black' ?
                            <div className={style.datos}> 
                              <span> {p?.player?.name}({p?.player?.elo})</span>
                              <img  
                                src={p?.player?.bandera} 
                                alt={`${p?.player?.country} flag`} 
                              />  
                            </div>
                              :
                            <div className={style.datos}>
                                <span> {p?.nameOpponent?.name}({p?.nameOpponent?.elo})</span>
                                <img  
                                   src={p?.nameOpponent?.bandera} 
                                   alt={`${p?.nameOpponent?.country} flag`} 
                                />
                            </div>  
                        }
                    </div>
                    <div className={style.result}>
                      <div className={style.valors}>
                          <p>
                              {
                                p?.player?.color === 'white' ? 
                                p?.player?.estado === 'won' ? '1' : 
                                p?.player?.estado === 'lost' ? '0' : '1/2' :
                                p?.nameOpponent?.estado === 'won' ? '1' :
                                p?.nameOpponent?.estado === 'lost' ? '0' : '1/2'
                              }
                          </p>
                          <p>
                            {
                                p?.player?.color === 'black' ? 
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
            </>))
            : <span>No hay historial</span>
          }
        </div>
    </div>
  </div>
  )
}

export default HistoryGames
import React, { useRef, useState } from 'react'
import SpinnerDowloand from '../../components/spinner/SpinnerDowloand'
import style from './Home.module.css';
import { useLanguagesContext } from '../../context/languagesContext/languagesContext'
import { useAuth } from '../../context/authContext/authContext'
import ButtonIcon from '../../components/button/ButtonIcon';
import HeaderHome from './headerHome';
// import TableRaking from './tableRaking'
import GameStats from './gameStats'
import HistoryGames from '../../components/history_games/HistoryGames'

function ContainerFondoHomeImage({joinRoom}) {
    const {auth, user} = useAuth();
   
    const [stast, setStats] = useState('fast');
    
    const {language} = useLanguagesContext();

    const miContaineHistorial = useRef(null);

    

   
    const handleClick = (data) => {
        setStats(data);
        miContaineHistorial?.current?.scrollIntoView({ behavior: 'smooth' });
    }

  return (
    <div className={style.containerFondoImage}>
     <div className={style.image}>
        <div className={style.home}>
          <HeaderHome joinRoom={joinRoom} miContaineHistorial={miContaineHistorial}/>
          {/* <TableRaking />             */}
        </div>
      </div>
     {
      auth?.user  && 
      <div className={style.fondoDatos} >
        <div className={style.containerStats}>
          <h5>
            {language?.statistics_of} {auth?.user?.name 
              ? `${auth?.user?.name} ${auth?.user?.lastName}`
              : `${auth?.user?.username}`}
          </h5>
        </div>
        <div  className={style.containerStats}>
           <ButtonIcon time={'fast'} handleClick={handleClick} />
           <ButtonIcon time={'blitz'} handleClick={handleClick} />
           <ButtonIcon time={'bullet'} handleClick={handleClick} />
        </div>
        <div className={style.containerStatsRating} >        
          <div className={style.containerNivel} 
             style={stast === 'fast' 
                     ? { background: 'rgba(162, 217, 206 ,0.4)'} 
                     : stast === 'blitz' 
                     ? { background: 'rgba(249, 231, 159 ,0.4)'} 
                     : { background: 'rgba(250, 215, 160,0.4)'}}
          >
            {!user?
              <SpinnerDowloand text={`${language?.loading_user_statistics} ${auth?.user?.name}. . .`} />
            :
                <GameStats stast={stast} />   
         }
        </div>
        </div>
        <HistoryGames />
      </div>
     }
     </div>
  )
}

export default ContainerFondoHomeImage
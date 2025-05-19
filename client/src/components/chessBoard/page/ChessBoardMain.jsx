import { useContext, useEffect, useState } from "react";

import Chess from "chess.js";
import { Chessboard } from "react-chessboard";
import { useWindowHeight, useWindowWidth } from "../../../hooks/useWindowWidth";
import { useChessboardContext } from "../../../context/boardContext/boardContext";
import { aiMove} from "js-chess-engine";
import ProfilePanel from "../components/profilePanel/ProfilePanel";
import { useAuth } from "../../../context/authContext/authContext";
import { assetsManager } from "../../../utils/constants/assetsManager";
import '../../Chessboard.css';
import style from './ChessBoardMain.module.css';
import RecordPlays from "../../board/RecordPlays";
import BoardInfo from "../../board/BoardInfo";
import ChatChess from "../../ChatChess";
import MinNabvar from "../../board/MinNabvar";
import ModalGameOver from "../components/modals/ModalGameOver";
import { GameContext } from "../../../context/gameContext/gameContext";
import { customPieces } from "@/Constants";

export default function ChessBoardMain() {
  const [game, setGame] = useState(new Chess());
  const {frase, setFrase} = useContext(GameContext);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [initialSquare, setInitialSquare] = useState(null);
  const [destinationSquare, setDestinationSquare] = useState(null);
  const [inCheckSquare, setInCheckSquare] = useState(null);
  const [allPossibleMoves, setAllPossibleMoves] = useState([]);
  const { boardColor } = useChessboardContext();
  const [turn, setTurn] = useState('w');
  const [colorType] = useState('w');
  const {user} = useAuth();
  const [isGameOver, setIsGameOver] = useState(false);
  const [scoreMePlayer, setScoreMePlayer] = useState('');
  const [scoreOtherPlayer, setScoreOtherPlayer] = useState('');
  
  const width = useWindowWidth();
  const height = useWindowHeight();

  useEffect(() => {
    if (turn === "b") {
      setTimeout(() => {
        makeAIMove();
      }, 200);
    }
  }, [turn,makeAIMove]);


  function makeAMove(move) {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    setGame(gameCopy);
    // if(!game.in_check()){
    //   setInCheckSquare(null);
    // }
    // if (game.in_check() && !game.in_checkmate()) {
    //   const { whiteKing, blackKing } = getKingPositions(gameCopy);
    //   console.log("White King:", whiteKing, "Black King:", blackKing);
    //    if(turn === 'b'){
    //       setInCheckSquare(blackKing)
    //    }else{
    //     setInCheckSquare(whiteKing)
    //    }
    // }
    return result;
  }

  useEffect(() => {
    if (game.in_check() && !game.in_checkmate()) {
      const { whiteKing, blackKing } = getKingPositions(game);
      console.log("White King:", whiteKing, "Black King:", blackKing);
      if (turn === 'b') {
        setInCheckSquare(blackKing);
      } else {
        setInCheckSquare(whiteKing);
      }
    } else {
      setInCheckSquare(null);
    }
  
    if (game.in_draw()) {
      console.log('empate');
    }
  
    if (game.in_checkmate()) {
      setFrase(
        colorType !== turn
          ? 'Has ganado por JakeMate'
          : 'Has perdido por jakeMate'
      );
      setScoreMePlayer(colorType !== turn ? '1' : '0');
      setScoreOtherPlayer(colorType !== turn ? '0' : '1');
      setIsGameOver(true);
      console.log('jakeMate', game.game_over());
    }
  
    if (game.in_stalemate()) {
      console.log('rey ahogado');
    }
  
    if (game.in_threefold_repetition()) {
      console.log('empate por repeticion');
    }
  
    if (game.insufficient_material()) {
      console.log('insuficiente Material');
    }
  }, [game, turn, colorType, setFrase, setScoreMePlayer, setScoreOtherPlayer, setIsGameOver, setInCheckSquare]);
  

  function getKingPositions(game) {
    let whiteKing = null;
    let blackKing = null;
  
    game.board().forEach((row, rowIndex) => {
      row.forEach((square, colIndex) => {
        if (square?.type === "k") {
            if(square?.color === 'b'){
              blackKing = `${"abcdefgh"[colIndex]}${8 - rowIndex}`;
              console.log('squares que es', square)
            }
            if (square?.color === "w"){
              whiteKing = `${"abcdefgh"[colIndex]}${8 - rowIndex}`;
           }
        }
        
      });
    });
  
    return { whiteKing, blackKing };
  }

  // function makeRandomMove() {
  //   const possibleMoves = game.moves();
  //   if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;
    
  //   const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  //   makeAMove(possibleMoves[randomIndex]);
  // }


  
  function makeAIMove() {
    if (game.game_over()) return;
  
    const aiBestMove =  aiMove(game.fen(), 0);
    console.log('aibestmove',Object.entries(aiBestMove)[0]) // Calcula el mejor movimiento
    const [f, t] = Object.entries(aiBestMove)[0]; // Extrae la jugada correcta
    const lowerCaseMoveFrom = f.charAt(0).toLowerCase() + f.slice(1);
    const from =  lowerCaseMoveFrom;

    const lowerCaseMoveto = t.charAt(0).toLowerCase() + t.slice(1);
    const to =  lowerCaseMoveto
    if (from && to) {
      makeAMove({ from, to, promotion: "q" }); // Asegura que se pasa correctamente el objeto
      setTurn("w");
    }
  }
  function onDrop(sourceSquare, targetSquare) {
    // console.log('ondrop', sourceSquare);
    setDestinationSquare(null);
    if(!targetSquare || turn === 'b') return;
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    
    if (move === null) return false;
    // 
    console.log('jugue yo');
    setAllPossibleMoves([]);
    setSelectedSquare(null);
    setInitialSquare(move.from);
    setDestinationSquare(targetSquare);
    setTurn('b');
    return true;
  }

  const handleSquareClick = (square, piece) => {
    console.log('handleSquareClick', square);
    setDestinationSquare(null);
    setInitialSquare(null);
    if (selectedSquare === null && piece && piece[0] === "b") return;
  
    if (selectedSquare && piece && piece[0] === "w") {
      const possibleMoves = game.moves({ square: square });
      setAllPossibleMoves(possibleMoves);
      setDestinationSquare(null);
      setSelectedSquare(square);
    } else if (selectedSquare && turn === 'w') {
      const move = makeAMove({ from: selectedSquare, to: square, promotion: "q" });
      if (!move) return false;
      setAllPossibleMoves([]);
      setSelectedSquare(null);
      setInitialSquare(move.from);
      setDestinationSquare(square);
      setTurn('b');
      // setTimeout(makeRandomMove, 200);
      return true;
    } else {
      if(!piece)return;
      setSelectedSquare(square);
      const possibleMoves = game.moves({ square: square });
      setAllPossibleMoves(possibleMoves);
    }
  };
  

const  handleOnPieceDragBegin = (piece, sourceSquare)=>{
    if(piece){
      setDestinationSquare(null);
      setInitialSquare(null);
      setSelectedSquare(sourceSquare);
      console.log('movimiento', sourceSquare)
      const possibleMoves = game.moves({ square: sourceSquare });
      setAllPossibleMoves(possibleMoves);
    // Mostrar en consola las jugadas posibles
    console.log(`Movimientos posibles para ${piece} en ${sourceSquare}:`, possibleMoves);
    }
  }

  const customSquareStyles = {
    ...({ 
      [selectedSquare]: { backgroundColor: "#ffeb3b" },
      [initialSquare]: { backgroundColor: "#fff59d" },
      [destinationSquare]: { backgroundColor: "#fff176" },
      [inCheckSquare]: { backgroundColor: "#f44336", transform: "scale(1.2)" }
    }),
    // Aplicar estilos a los movimientos posibles
    ...Object.fromEntries(
      allPossibleMoves?.map((move) => {
        // Remover "+" si está al final
        let cleanMove = move.replace("+", ""); 
        
        // Extraer solo la casilla (últimos dos caracteres después de limpiar)
        const square = cleanMove.slice(-2);
  
        // Si contiene "x", es una captura → borde circular
        if (cleanMove.includes("x")) {
          return [
            square,
            {
              boxShadow: "0 0 0 6px rgba(0, 0, 0, 0.2)", // Crea un borde sin afectar el tamaño
              borderRadius: "50%", // Forma circular
              width: "90%", // Reduce el tamaño del elemento
              height: "90%", 
              display: 'flex',
              margin: "auto",
            }
          ];
        } else {
          // Movimiento normal → círculo en el centro
          return [
            square,
            {
              background: "radial-gradient(circle, rgba(0, 0, 0, 0.2) 30%, transparent 33%)",
            }
          ];
        }
      })
    )
  };
  
  return (
    <div 
      style={{ 
        width: "100%", 
        height: "100dvh", 
        display: "flex",
        overflow: "auto",
        flexDirection: height +180 < width ? 'row' : 'column', 
        justifyContent: height +180 < width ? "center" : "flex-start", 
        alignItems: "center",
     }}
    >
      <div style={{
        height: height, 
        width: height - 200 < width ? height *0.72 : width,
        display: "flex",
        flexDirection: 'column', 
        justifyContent: "center", 
        alignItems: "center",

      }}>
        <ProfilePanel 
          marco={assetsManager.imageFrames[0]} 
          photo={assetsManager.imagebots[0]}
          username={'principiante'}
          elo={100}
          flags={assetsManager.flagsBot}
          alignItems={'flex-end'}
        />
        <div style={{
          height: height -200 < width ? height *0.72: width,
          width: height -200 < width ? height*0.72 : width,
        }}>
          <Chessboard
            boardWidth={height-200 < width ? height *0.72 : width}
            position={game.fen()}
            customSquareStyles={customSquareStyles}
            onPieceDrop={onDrop}
            onSquareClick={handleSquareClick}
            autoPromoteToQueen={false}
            customPieces={customPieces}
            customLightSquareStyle={{ backgroundColor: boardColor.whiteRow , fontFamily: "ADLaM Display",}}
            customDarkSquareStyle={{ backgroundColor: boardColor.blackRow, fontFamily: "ADLaM Display", }}
            onPieceDragBegin={handleOnPieceDragBegin}
            showPromotionDialog={true}
          />
        </div>
        <ProfilePanel 
          marco={user?.marco} 
          photo={user?.photo}
          username={user?.username}
          elo={user?.eloBullet}
          flags={user?.imagenBandera}
          alignItems={'flex-start'}
        />
      </div>
      <div style={{
        display: width < 450 ? 'none' : 'block',
        height: height + 180 < width ? height*0.9 : '40rem',
        minHeight: height + 180 < width ? height*0.9 : '40rem', 
        width: height + 180 < width ? height *0.5 : height -200 > width ? width : height*0.72,
        marginLeft: height + 180 < width ?  '0.2rem' : '0',
      }} 
      >
        <div 
          className={style.dashboard} 
          style={{background: boardColor?.register || 'linear-gradient(89deg, rgb(21, 74, 189) 0.1%, rgb(26, 138, 211) 51.5%, rgb(72, 177, 234) 100.2%)' }}
        >
          <h5>{'Registro de jugadas'.toUpperCase()}</h5>
          <div className={style.money}>
            <img src="/icon/moneda.png" alt="" />
            <span>{1000}</span> 
          </div>              
        </div>
        <RecordPlays/>
        <div className={style.chat}>
          <ChatChess />
        </div>
         <BoardInfo />
    </div>
    <MinNabvar/>
    {isGameOver 
      && <ModalGameOver 
            colorType={colorType}
            scoreMePlayer={scoreMePlayer}
            scoreOtherPlayer={scoreOtherPlayer}
            frase={frase}
            turn={turn}
            timeType={'Rapid'}
            textSpinner={'a home'}
         />
    }
    </div>
  );
}

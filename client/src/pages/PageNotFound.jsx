import { Link } from "react-router-dom";
import style from './PageNotFound.module.css';
import { useChessboardContext } from "../context/boardContext/boardContext";

function NotFound() {
  const {chessColor} = useChessboardContext();
    return (
      <div 
        className={style.notfound}
        style={{background: chessColor.fondo, color: chessColor.colorInvertido}}
      >
        <h1 style={{color: chessColor.colorInvertido}}>404 - Page Not Found</h1>
        <p style={{color: chessColor.colorInvertido}}>The page you are looking for does not exist.</p>
        <Link  to="/">Go to Home</Link>
      </div>
    );
  }

  export default NotFound;
import { Link } from "react-router-dom";
import style from './pageNotFound.module.css';

export function NotFound() {
    return (
      <div className={style.notfound}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/">Go to Home</Link>
      </div>
    );
  }
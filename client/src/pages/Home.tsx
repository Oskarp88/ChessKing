import style from "./Home.module.css";

export function Home() {
    return (
      <div className={style.home}>
        <h1>Welcome to ChessKing</h1>
        <p>Play chess online and improve your skills!</p>
      </div>
    );
  }
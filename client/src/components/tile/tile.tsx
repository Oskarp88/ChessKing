import { useChessboardContext } from "../../Context/boardContext";
import "./Tile.css";

interface Props{
    image?: string;
    number: number;
    highlight: boolean;
}

const Tile = ({number,image, highlight}: Props) => {
    const { boardColor } = useChessboardContext();
    const {blackTile, whiteTile} = boardColor;
    const className: string = ["tile",
        number % 2 === 0 && "black-tile",
        number % 2 !== 0 && "white-tile",
        highlight && "tile-highlight", 
        image && "chess-piece-tile"].filter(Boolean).join(' ');

        const tileStyle = {
            backgroundColor: number % 2 === 0 ? blackTile : whiteTile
          };
        
    return (
        <div className={className} style={tileStyle}>
            {image && <div style={{backgroundImage:`url(${image})`}} className='chess-piece' ></div>}
        </div> 
    );   
    
}
 
export default Tile;
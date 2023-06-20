import React, { useState, useEffect } from 'react';
import './NavBar.css';
import { useChessboardContext } from '../../Context/boardContext';


interface Color {
  id: number;
  blackTile: string;
  whiteTile: string;
  register: string;
}

const colorBoard: Color[] = [
  { id: 1, blackTile: '#2E86C1', whiteTile: '#D6EAF8', register: 'linear-gradient(89deg, rgb(21, 74, 189) 0.1%, rgb(26, 138, 211) 51.5%, rgb(72, 177, 234) 100.2%)' },
  { id: 2, blackTile: '#779556', whiteTile: '#ebecd0', register: 'radial-gradient(circle at -1% 57.5%, rgb(19, 170, 82) 0%, rgb(0, 102, 43) 90%)' },
  { id: 3, blackTile: '#276d78', whiteTile: '#bbe4e9', register: 'radial-gradient(circle at 5.6% 54.5%, rgb(47, 71, 79) 0%, rgb(159, 188, 198) 83.6%)' },
  { id: 4, blackTile: '#f76b8a', whiteTile: '#ffcbcb', register: 'linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)' },
  { id: 5, blackTile: '#f96d00', whiteTile: '#ffebbb', register: 'linear-gradient(105.6deg, rgb(246, 220, 111) 12.4%, rgb(222, 104, 104) 78.7%)' },
  { id: 6, blackTile: '#8a1253', whiteTile: '#cca8e9', register: 'linear-gradient(98.3deg, rgb(0, 0, 0) 10.6%, rgb(135, 16, 16) 97.7%)' },
  { id: 7, blackTile: '#004445', whiteTile: '#b4e3dd', register: 'radial-gradient(759px at 14% 22.3%, rgb(10, 64, 88) 0%, rgb(15, 164, 102) 90%)' },
  { id: 8, blackTile: '#263849', whiteTile: '#aeccc6', register: 'linear-gradient(177.9deg, rgb(58, 62, 88) 3.6%, rgb(119, 127, 148) 105.8%)' },
];

interface BoardColor {
  blackTile: string;
  whiteTile: string;
  register: string;
}

function NavBar() {
  const { setBoardColor } = useChessboardContext();
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState(colorBoard[0].id);
  const [playTactoSound, setPlayTactoSound] = useState(false);

  useEffect(() => {
    const audio = new Audio('sound/toque.mp3');
    audio.addEventListener('ended', () => setPlayTactoSound(false));
  
    return () => {
      audio.removeEventListener('ended', () => setPlayTactoSound(false));
    };
  }, []);
  
  useEffect(() => {
    const selectedColor = colorBoard.find((c) => c.id === selectedColorId);

    if (selectedColor) {
      setBoardColor({
        blackTile: selectedColor.blackTile,
        whiteTile: selectedColor.whiteTile,
        register: selectedColor.register
      });

       // Reproducir el sonido cuando se suelta una pieza en una posición válida
    if (playTactoSound) {
      const audio = new Audio('sound/toque.mp3');
      audio.play();
    }
    }
  }, [selectedColorId, setBoardColor]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColorId(Number(event.target.value));
    // Reproducir el sonido
  setPlayTactoSound(true);
  };

  const toggleColorOptions = () => {
    setShowColorOptions(!showColorOptions);
  };

  return (
    <div className="navbar">
      <ul>
        <li>
          <span onClick={toggleColorOptions}>
            Colores Casillas
          </span>
          {
            showColorOptions && <div className="color-options">
            {colorBoard.map((c) => (
              <label key={c.id} className="color-option">
                <input
                  type="radio"
                  name="color"
                  value={c.id}
                  onChange={handleColorChange}
                  checked={c.id === selectedColorId}
                />
                <div className="color-board" style={{ backgroundColor: c.blackTile }}></div>
                <div className="color-board" style={{ backgroundColor: c.whiteTile }}></div>
              </label>
            ))}
          </div>
          }
        </li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
      </ul>
    </div>
  );
}

export default NavBar;

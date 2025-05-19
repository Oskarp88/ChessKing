import React, { useEffect, useState } from 'react';
import style from './ModalConfig.module.css'; // Asegúrate de importar correctamente el archivo CSS
import { useChessboardContext } from '../../context/boardContext/boardContext';
import { CircleClose } from '../../svg';

const colorBoard = [
    { id: 1, blackRow: '#2E86C1', whiteRow: '#ebecd0', blackTile: 'black-tile-azul', whiteTile: 'white-tile-azul', register: 'linear-gradient(89deg, rgb(21, 74, 189) 0.1%, rgb(26, 138, 211) 51.5%, rgb(72, 177, 234) 100.2%)' },
    { id: 2, blackRow: '#779556', whiteRow: '#ebecd0', blackTile: 'black-tile-verde', whiteTile: 'white-tile-verde', register: 'radial-gradient(circle at -1% 57.5%, rgb(19, 170, 82) 0%, rgb(0, 102, 43) 90%)' },
    { id: 3, blackRow: '#276d78', whiteRow: '#bbe4e9', blackTile: 'black-tile-verdeGris', whiteTile: 'white-tile-verdeGris', register: 'radial-gradient(circle at 5.6% 54.5%, rgb(47, 71, 79) 0%, rgb(159, 188, 198) 83.6%)' },
    { id: 4, blackRow: '#e7617e', whiteRow: '#ffcbcb', blackTile: 'black-tile-rosa', whiteTile: 'white-tile-rosa', register: 'linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)' },
    { id: 5, blackRow: '#f96d00', whiteRow: '#ffebbb', blackTile: 'black-tile-naranja', whiteTile: 'white-tile-naranja', register: 'linear-gradient(105.6deg, rgb(246, 220, 111) 12.4%, rgb(222, 104, 104) 78.7%)' },
    { id: 6, blackRow: '#810404', whiteRow: '#f0bdbd', blackTile: 'black-tile-rojo', whiteTile: 'white-tile-rojo', register: 'linear-gradient(98.3deg, rgb(0, 0, 0) 10.6%, rgb(135, 16, 16) 97.7%)' },
    { id: 7, blackRow: '#004445', whiteRow: '#d1ebe7', blackTile: 'black-tile-verdeOscuro', whiteTile: 'white-tile-verdeOscuro', register: 'radial-gradient(759px at 14% 22.3%, rgb(10, 64, 88) 0%, rgb(15, 164, 102) 90%)' },
    { id: 8, blackRow: '#263849', whiteRow: '#c8dad7', blackTile: 'black-tile-azulOscuro', whiteTile: 'white-tile-azulOscuro', register: 'linear-gradient(177.9deg, rgb(58, 62, 88) 3.6%, rgb(119, 127, 148) 105.8%)' },
  ];

const ModalConfig = ({setModalConfig}) => {
    const { setBoardColor } = useChessboardContext();
    // const {setPieceFile} = usePieceContext();
    const [showColorOptions, setShowColorOptions] = useState(false);
    // const [showPieceOptions, setShowPieceOptions] = useState(false);
    const [selectedColorId, setSelectedColorId] = useState(colorBoard[0].id);

    useEffect(()=>{
      const isColorId = parseInt(localStorage.getItem('colorId'));
      if(!isNaN(isColorId) && isColorId){
        setSelectedColorId(isColorId);
      }
      const isColorBoard = localStorage.getItem('boardColor');
      if(isColorBoard){
         const parseData = JSON.parse(isColorBoard);
         setBoardColor({
          blackTile: parseData.blackTile,
          whiteTile: parseData.whiteTile,
          register: parseData.register,
          whiteRow: parseData.whiteRow,
          blackRow: parseData.blackRow
        });
      }
    },[]);

    useEffect(() => {
        const selectedColor = colorBoard?.find((c) => c.id === selectedColorId);
    
        if (selectedColor) {
          setBoardColor({
            blackTile: selectedColor.blackTile,
            whiteTile: selectedColor.whiteTile,
            register: selectedColor.register,
            whiteRow: selectedColor.whiteRow,
            blackRow: selectedColor.blackRow
          });
          localStorage.setItem('boardColor',
            JSON.stringify({ 
              blackTile: selectedColor.blackTile,
              whiteTile: selectedColor.whiteTile,
              register: selectedColor.register,
              whiteRow: selectedColor.whiteRow,
              blackRow: selectedColor.blackRow
          }));
        }
      }, [selectedColorId, setBoardColor]);

      const handleColorChange = (colorId) => {
        setSelectedColorId(colorId);
        localStorage.setItem('colorId', colorId);
      };
    
      const toggleColorOptions = () => {
        setShowColorOptions(!showColorOptions);
      };

      const handleClose = () => {
         setModalConfig(false);
      }

  return (
    <div className={style.overlay}>
      <div className={style.gameOverModal}>
        <div className={style.header}>
          <a  className={style.close} onClick={handleClose}>
             <CircleClose />
          </a>
          <h2>Configuración</h2>
        </div>
       <div className={style.body}>
        <span className={style.icon} onClick={toggleColorOptions}>
            Cambia los Colores de las Casillas
        </span>
        <div className={style.board}>
            <div className={style.coloroptions}>
                {colorBoard.map((c, index) => {
                const isEvenIndex = (index + 1) % 2 === 0;

                return (
                <div key={c.id} className={`${style.coloroption} ${isEvenIndex ? `${style.even}` : `${style.odd}`}`} onClick={() => handleColorChange(c.id)}>
                
                <div className={style.colorrow}>
                    <div className={style.colorboard} style={{ backgroundColor: c.blackRow }}></div>
                    <div className={style.colorboard} style={{ backgroundColor: c.whiteRow }}></div>
                </div>
                <div className={style.colorrow}>
                    <div className={style.colorboard} style={{ backgroundColor: c.whiteRow }}></div>
                    <div className={style.colorboard} style={{ backgroundColor: c.blackRow }}></div>
                </div>
            </div>)}
            )}         
            </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ModalConfig;

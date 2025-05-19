import { useState, useEffect } from "react";

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    // Escuchar el evento 'resize'
    window.addEventListener("resize", handleResize);

    // Limpieza del efecto al desmontar el componente
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export function useWindowHeight() {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);

    // Escuchar el evento 'resize'
    window.addEventListener("resize", handleResize);

    // Limpieza del efecto al desmontar el componente
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return height;
}


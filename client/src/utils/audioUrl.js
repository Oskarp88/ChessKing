import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "./firebase";

// Ejemplo para obtener la URL del archivo
export const getAudioURL = async (path) => {
  const audioRef = ref(storage, path);
  try {
    const url = await getDownloadURL(audioRef);
    return url;
  } catch (error) {
    console.error("Error al obtener la URL:", error);
    return null;
  }
};
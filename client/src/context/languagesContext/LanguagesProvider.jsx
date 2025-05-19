import React, { useEffect, useState } from 'react';
import { LanguagesContext } from './LanguagesContext';
import { languages } from '@/utils/languages';


export const LanguagesProvider = ({ children }) => {
  const [language, setLanguage] = useState(languages[1]);

  useEffect(() => {
    const languageNum = localStorage.getItem('languageNum');
    if (!isNaN(languageNum) && languageNum) {
      setLanguage(languages[parseInt(languageNum)]);
    }
  }, []);

  return (
    <LanguagesContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguagesContext.Provider>
  );
};

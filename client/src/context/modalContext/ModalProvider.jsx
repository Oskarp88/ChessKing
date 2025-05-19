import React, { useState } from 'react';
import { ModalContext } from './ModalContext';

const ModalProvider = ({ children }) => {
  const [showModalMin, setShowModalMin] = useState(false);

  return (
    <ModalContext.Provider value={{ showModalMin, setShowModalMin }}>
      {children}
    </ModalContext.Provider>
  );
};

export { ModalProvider };

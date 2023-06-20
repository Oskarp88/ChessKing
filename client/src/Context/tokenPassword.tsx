import React, { createContext, useContext, useState } from 'react';


interface TokenPassword{
    token: string;
}
interface TokenPasswordContextProps {
    tokenPassword: TokenPassword;
    setTokenPassword: React.Dispatch<React.SetStateAction<TokenPassword>>;
  }

const TokenPasswordContext = createContext<TokenPasswordContextProps | undefined>(undefined);

export const useTokenPasswordContext = (): TokenPasswordContextProps => {
  const context = useContext(TokenPasswordContext);
  if (!context) {
    throw new Error('useTokenPasswordContext must be used within a ChessboardProvider');
  }
  return context;
};

export const TokenPasswordProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  const [tokenPassword, setTokenPassword] = useState<TokenPassword>({token: ''});
  
  return (
    <TokenPasswordContext.Provider value={{ tokenPassword, setTokenPassword }}>
      {children}
    </TokenPasswordContext.Provider>
  );
};

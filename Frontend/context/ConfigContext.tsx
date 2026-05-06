import React, { createContext, useState, useContext } from 'react';

// 'light' adicionado aqui
type ThemeType = 'dark' | 'light' | 'lightBlue'; 
type LanguageType = 'pt' | 'en';

interface ConfigContextData {
  theme: ThemeType;
  language: LanguageType;
  setTheme: (theme: ThemeType) => void;
  setLanguage: (lang: LanguageType) => void;
}

const ConfigContext = createContext<ConfigContextData>({} as ConfigContextData);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [language, setLanguage] = useState<LanguageType>('pt');

  return (
    <ConfigContext.Provider value={{ theme, setTheme, language, setLanguage }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
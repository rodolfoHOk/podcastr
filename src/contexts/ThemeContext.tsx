import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type ThemeContextData = {
  isDarkTheme: boolean;
  setTheme: (string) => void;
}

const ThemeContext = createContext({} as ThemeContextData);

export function ThemeProvider({ children }:{ children: ReactNode }) {

  const [ isDarkTheme, setIsDarkTheme ] = useState(false);

  function getTheme() {
    if (localStorage.getItem('theme')) {
      if (localStorage.getItem('theme') === 'theme-light') {
        setIsDarkTheme(false);
      } else if (localStorage.getItem('theme') === 'theme-dark') {
        setIsDarkTheme(true);
      }
    } else {
      localStorage.setItem('theme', 'theme-light');
      setIsDarkTheme(false);
    }
  }

  function setTheme(themeName: string) {
    if (themeName === 'theme-light') {
      setIsDarkTheme(false);
      localStorage.setItem('theme', themeName);
    } else if (themeName === 'theme-dark') {
      setIsDarkTheme(true);
      localStorage.setItem('theme', themeName);
    }
  }

  useEffect(() => {
    getTheme();
  },[]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

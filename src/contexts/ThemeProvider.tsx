import React, { useEffect } from "react";
import { THEMES } from "theme/variant";

interface InitialStateType {
  theme: string;
  setTheme: (theme: string) => void;
}

const initialState: InitialStateType = {
  theme: THEMES.DEFAULT,
  setTheme: () => {},
};

const ThemeContext = React.createContext(initialState);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, _setTheme] = React.useState(initialState.theme);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      _setTheme(JSON.parse(storedTheme));
    }
  }, []);

  const setTheme = (theme: string) => {
    localStorage.setItem("theme", JSON.stringify(theme));
    _setTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProvider };

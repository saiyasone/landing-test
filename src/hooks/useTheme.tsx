import { ThemeContext } from "contexts/ThemeProvider";
import { useContext } from "react";

const useTheme = () => useContext(ThemeContext);

export default useTheme;

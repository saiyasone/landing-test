import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import routes from "app/routes";
import useTheme from "hooks/useTheme";
import { useRoutes } from "react-router-dom";
import createTheme from "theme";

const emotionCache = createCache({ key: "css" });

function App() {
  const content = useRoutes(routes);
  const { theme } = useTheme();
  return (
    <CacheProvider value={emotionCache}>
      <MuiThemeProvider theme={createTheme(theme)}>{content}</MuiThemeProvider>
    </CacheProvider>
  );
}

export default App;

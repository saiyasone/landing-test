import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";

import { CssBaseline } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import GlobalStyle from "styles/GlobalStyle";
import createTheme from "theme";
import { THEMES } from "theme/variant";

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PresentationLayout = () => {
  return (
    <MuiThemeProvider theme={createTheme(THEMES.DEFAULT)}>
      <Root>
        <CssBaseline />
        <GlobalStyle />
        <AppContent>
          <Outlet />
        </AppContent>
      </Root>
    </MuiThemeProvider>
  );
};

export default PresentationLayout;

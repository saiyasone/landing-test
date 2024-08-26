import styled from "@emotion/styled";
import { CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import GlobalStyle from "styles/GlobalStyle";

const Root = styled.div`
  // max-width: 520px;
  max-width: auto;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
  height: 100%;
  flex-direction: column;
`;

const PageLayout = () => {
  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <Outlet />
    </Root>
  );
};

export default PageLayout;

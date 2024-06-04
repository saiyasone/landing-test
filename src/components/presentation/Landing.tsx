import { Box } from "@mui/material";
import React from "react";
import "styles/presentation/presentation.css";
import * as MUI from "styles/presentation/presentation.style";
import AppBar from "./AppBar";
import Footer from "./Footer";

const Landing = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <Box sx={{ position: "relative" }}>
        <AppBar />
        <MUI.BoxHomepage>{children}</MUI.BoxHomepage>
        <Footer />
      </Box>
    </React.Fragment>
  );
};

export default Landing;

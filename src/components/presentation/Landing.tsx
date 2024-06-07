import { Box } from "@mui/material";
import React from "react";
import "styles/presentation/presentation.style.css";

const AppBar = React.lazy(() => import("./AppBar"));
const Footer = React.lazy(() => import("./Footer"));
const BoxHomepage = React.lazy(() =>
  import("styles/presentation/presentation.style").then((module) => ({
    default: module.BoxHomepage,
  })),
);

const Landing = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <Box sx={{ position: "relative" }}>
        <AppBar />
        <BoxHomepage>{children}</BoxHomepage>
        <Footer />
      </Box>
    </React.Fragment>
  );
};

export default Landing;

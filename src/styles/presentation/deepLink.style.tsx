import { createTheme, styled } from "@mui/material";
const theme = createTheme();

export const BottomBackDrop = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 999,
  cursor: "pointer",
});

export const BottomContainer = styled("div")({
  position: "fixed",
  left: 0,
  bottom: "-100%",
  width: "100%",
  minHeight: "160px",
  backgroundColor: "#fff",
  borderTopLeftRadius: "15px",
  borderTopRightRadius: "15px",
  zIndex: 9999,
  boxShadow:
    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
  transition: "bottom 0.5s",

  "&.active": {
    bottom: "0",
  },
});

export const BottomWrapper = styled("div")({
  padding: "16px",
});

export const BottomHeader = styled("h1")({
  textAlign: "center",
  fontSize: "1.2rem",
  fontWeight: "600",
  margin: 0,
  paddingTop: "10px",
});

export const BottomPanel = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px 15px",
  gap: "1.2rem",
});

export const BottomPanelItem = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
});

export const BoxLeft = styled("div")({
  display: "flex",
  alignItems: "center",
  img: {
    width: "38px",
    height: "38px",
    objectFit: "cover",
    marginRight: 12,
  },

  h2: {
    fontSize: "16px",
  },
});

export const BoxRight = styled("div")({
  button: {
    borderRadius: "30px",
    maxWidth: "100px",
    minWidth: "100px",

    "&.default": {
      color: "#17766B",
    },
  },
});

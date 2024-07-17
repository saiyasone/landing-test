import { styled, createTheme } from "@mui/material";
const theme = createTheme();

export const PricingCheckoutContainer = styled("div")(({ theme }) => ({
  borderRadius: "8px",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  [theme.breakpoints.down("lg")]: {
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  [theme.breakpoints.down("md")]: {
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: "20px",
    marginRight: "20px",
  },
}));

export const PricingCheckoutHeader = styled("div")({});

export const PricingCheckoutBody = styled("div")(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(5),
  color: `${theme.palette.primaryTheme!.brown()} !important`,
  overflow: "hidden",
}));

export const StepCheckoutBox = styled("div")<{ isMobile: boolean }>(
  ({ isMobile }) => ({
    width: "100%",
    minHeight: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...(isMobile &&
      {
        // padding: 5,
      }),

    [theme.breakpoints.down(630)]: {
      justifyContent: "flex-start",
      padding: "20px 0px",
    },
  }),
);

export const TitleAndSwitch = styled("div")({
  display: "flex",
  height: "50px",
  minHeight: "50px",
  alignItems: "center",
  justifyContent: "space-between",
});

export const StepperStyledContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "2rem",

  [theme.breakpoints.down(630)]: {
    flexDirection: "column",
  },
});

export const StepperStyledBoxContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "250px",
  position: "relative",

  [theme.breakpoints.down("md")]: {
    width: "160px",
  },
});

export const StepperStyledBoxLeft = styled("div")({
  width: "100%",
  display: "flex",
  alignItems: "center",
});

export const StepperStyledBoxIcon = styled("div")<{ isActive: boolean }>(
  ({ isActive }) => ({
    width: "50px",
    height: "40px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: isActive ? "#17766B" : "#eee",
    color: isActive ? "#fff" : "#4B465C",
    svg: {
      fontSize: "1.3rem",
    },
  }),
);

export const StepperStyledBoxTitle = styled("div")({
  marginLeft: "10px",
  display: "flex",
  flexDirection: "column",
  color: "#4B465C",
  width: "100%",

  p: {
    fontSize: "0.9rem",
    fontWeight: "bold",
  },

  span: {
    fontSize: "12px",
    fontWeight: "300",
  },
});

export const StepperStyledBoxRight = styled("div")({});

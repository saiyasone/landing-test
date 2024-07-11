import { styled, createTheme } from "@mui/material";

const theme = createTheme();

export const PricingCheckoutBoxContainer = styled("div")({
  height: "100vh",
  backgroundColor: "#fff",
});

export const PricingCheckoutContainer = styled("div")({
  marginBottom: "1rem",
  position: "relative",
});

export const PriceCheckoutSignUpFormContainer = styled("div")({
  maxWidth: "600px",
  margin: "0 auto",
  paddingTop: "2.5rem",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  [theme.breakpoints.down("md")]: {
    padding: "0 15px",
  },
});

export const PriceCheckoutSignUpContainer = styled("div")({
  position: "relative",
  flexGrow: "1",
});

export const PriceCheckoutSignUpHeader = styled("div")({
  textAlign: "center",
  marginBottom: "1.2rem",
  color: "#4B465C",

  h2: {
    fontSize: "1.6rem",
    marginBottom: "1rem",

    [theme.breakpoints.down("sm")]: {
      marginBottom: "10px",
    },
  },
  h4: {
    fontSize: "1rem",

    a: {
      color: "#17766B",
      fontWeight: "inherit",
      fontSize: "inherit",

      "&:hover": {
        textDecoration: "underline !important",
      },
    },
  },
});

export const PriceCheckoutSignUpForm = styled("form")({
  marginBottom: "1rem",
});

export const PriceCheckoutLabel = styled("label")({
  display: "block",
  marginBottom: "0.3rem",
  fontSize: "0.9rem",
});

export const PriceCheckoutAction = styled("div")({
  marginTop: "1.5rem",

  button: {
    verticalAlign: "middle",
    fontSize: "0.8rem",
  },

  [theme.breakpoints.down("sm")]: {
    marginTop: "1rem",
  },
});

export const PriceCheckoutSignUpLineFlex = styled("div")({
  display: "flex",
  alignItems: "center",
  margin: "1.2rem 0",

  p: {
    fontSize: "0.75rem",
    color: "#4B465C",
    textTransform: "uppercase",
    margin: "0 12px",
  },
});

export const PriceCheckoutSignUpLine = styled("div")({
  width: "100%",
  height: "1px",
  backgroundColor: "#ccc",
});

export const PriceCheckoutSignUpFooter = styled("div")({
  position: "relative",
});

export const GoogleSignUpButton = styled("button")({
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#fff",
  fontSize: "0.9rem",
  outline: "none",
  cursor: "pointer",
  fontWeight: "500",
  padding: "6px 10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: "#f3f5f6",
  },

  img: {
    width: "22px",
    height: "22px",
    objectFit: "cover",
    marginRight: "10px",
  },
});

export const PriceCheckoutPrivacy = styled("div")({
  textAlign: "center",
  marginTop: "1rem",

  h5: {
    fontSize: "0.8rem",
    color: "#4B465C",
    fontWeight: "500",

    a: {
      textDecoration: "underline !important",
      fontSize: "inherit",
      color: "inherit",
    },
  },
});

export const PricePaymentContainer = styled("div")({
  maxWidth: "1024px",
  margin: "0 auto",
});

export const PricePaymentContainerBox = styled("div")({
  padding: "1rem",
  height: "100%",
});

export const PricePaymentFormContainer = styled("div")({
  position: "relative",
  // padding: "0 1.1rem",
  marginBottom: "14px",
});

export const PricePaymentHeader = styled("h2")({
  fontSize: "1rem",
  fontWeight: "500",
  margin: "0",
});

export const PricePaymentSelector = styled("div")({
  margin: "12px 0",
  display: "flex",
  alignItems: "center",
  gap: "1rem",

  input: {
    margin: "0",
    ":checked": {
      "+ .payment-selector": {
        borderColor: "#17766B",
        ".payment-circle": {
          border: "5px solid #17766B",
        },
      },
    },
  },

  [theme.breakpoints.down(500)]: {
    flexDirection: "column",
  },
});

export const PricePaymentLabel = styled("label")({
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "6px 14px",
  height: "50px",
  width: "100%",
  cursor: "pointer",

  display: "flex",
  alignItems: "center",
});

export const PricePaymentLabelCircle = styled("div")({
  width: "15px",
  height: "15px",
  borderRadius: "50%",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
});

export const PricePaymentBox = styled("div")({
  display: "flex",
  alignItems: "center",
  marginLeft: "1rem",

  p: {
    fontSize: "0.7rem",
    fontWeight: "500",
  },

  img: {
    width: "25px",
    height: "25px",
    objectFit: "cover",
    marginRight: "7px",
  },
});

export const PricePaymentQRCode = styled("div")({
  marginTop: "1.2rem",
  marginBottom: "12px",

  h4: {
    fontSize: "0.85rem",
    fontWeight: "500",
    color: "#4B465C",
  },
});

export const PricePaymentForm = styled("div")({
  marginBottom: "0.6rem",
});

export const PricePaymentQRCodeContainer = styled("div")({
  // marginBottom: "0.8rem",
});

export const PricePaymentSummaryContainer = styled("div")({
  borderLeft: "1px solid #eee",
  height: "100%",
});

export const PricePaymentSummaryHeader = styled("div")({
  marginBottom: "3rem",
  color: "#4B465C",

  h2: {
    fontSize: "1rem",
    fontWeight: "500",
    marginBottom: "0.4rem",
  },

  p: {
    fontSize: "0.8rem",
  },
});

export const PricePaymentSummaryBoxPrice = styled("div")({
  borderRadius: "5px",
  background: "#F1F0F2",
  padding: "1rem",
});

export const SummaryTitle = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  p: {
    fontSize: "0.9rem",
    color: "#4B465C",
    fontWeight: "500",
  },
});

export const SummaryBoxPriceBody = styled("div")({
  position: "relative",
  margin: "1rem 0",

  h2: {
    fontSize: "2.5rem",
    color: "#4B465C",

    span: {
      color: "inherit",
      fontSize: "0.66rem",
    },
  },
});

export const SummaryButton = styled("button")({
  cursor: "pointer",
  outline: "none",
  borderRadius: "5px",
  border: "none",
  padding: "6px 12px",
  height: "33px",
  fontWeight: "500",
  width: "100%",
  color: "#17766B",
  backgroundColor: "#CEDCDC",
});

export const SummaryListContainer = styled("div")({
  marginTop: "1rem",
});

export const SummaryListFlex = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "8px",

  "p, span": {
    fontSize: "0.85rem",
  },

  p: {
    fontWeight: "500",
  },
  span: {
    fontWeight: "600",
  },
});

export const SummaryNoteContainer = styled("div")({
  marginTop: "1rem",

  p: {
    fontSize: "0.8rem",
    color: "#4B465C",
    fontWeight: "400",
    lineHeight: "1.2rem",
    marginBottom: "1rem",
  },
});

export const PricePackageConfirmation = styled("div")({
  maxWidth: "992px",
  margin: "0 auto",
});

export const StepperIconContainer = styled("div")({
  width: "40px",
  height: "40px",
  borderRadius: "5px",
  backgroundColor: "#f3f5f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  // "*": {
  //   color: "#ccc",
  // },
});

export const StepperHeaderContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  marginLeft: "0.5rem",

  "p, span": {
    color: "#5D596C",
  },

  p: {
    fontWeight: "600",
  },
});

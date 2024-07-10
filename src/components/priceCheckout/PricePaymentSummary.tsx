import * as MUI from "styles/priceCheckoutStyle";
import Typography from "@mui/material/Typography";
import { Button, MenuItem, useMediaQuery } from "@mui/material";
import NextIcon from "@mui/icons-material/EastSharp";
import SelectStyled from "components/SelectStyled";
import { useState } from "react";

function PricePaymentSummary() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [selectPayment, setSelectPayment] = useState("monthly");
  return (
    <MUI.PricePaymentSummaryContainer>
      <MUI.PricePaymentContainerBox>
        <MUI.PricePaymentSummaryHeader>
          <Typography variant="h2">Order Summary</Typography>
          <Typography component={`p`}>Email: hehe@gmail.com</Typography>
        </MUI.PricePaymentSummaryHeader>

        <MUI.PricePaymentSummaryBoxPrice>
          <MUI.SummaryTitle>
            <Typography component={`p`}>Your plan</Typography>
            <SelectStyled
              SelectDisplayProps={{
                sx: {
                  overflow: "unset !important",
                },
              }}
              value={selectPayment}
              variant="outlined"
              onChange={(e) => {
                setSelectPayment(e.target.value);
              }}
              sx={{
                overflow: "unset",
              }}
            >
              <MenuItem
                value={"weekly"}
                sx={{
                  ...(isMobile && {
                    minHeight: "20px",
                    fontSize: "0.7rem",
                  }),
                }}
              >
                Weekly
              </MenuItem>
              <MenuItem
                value={"monthly"}
                sx={{
                  ...(isMobile && {
                    minHeight: "20px",
                    fontSize: "0.7rem",
                  }),
                }}
              >
                Monthly
              </MenuItem>
            </SelectStyled>
          </MUI.SummaryTitle>

          <MUI.SummaryBoxPriceBody>
            <Typography variant="h2">
              $49.99<Typography component={"span"}>/month</Typography>{" "}
            </Typography>
          </MUI.SummaryBoxPriceBody>

          <MUI.SummaryButton>vShare Pro</MUI.SummaryButton>
        </MUI.PricePaymentSummaryBoxPrice>

        <MUI.SummaryListContainer>
          <MUI.SummaryListFlex>
            <Typography component={`p`}>Subscription</Typography>
            <Typography component={`span`}>$49.99</Typography>
          </MUI.SummaryListFlex>
          <MUI.SummaryListFlex>
            <Typography component={`p`}>Coupon Discount</Typography>
            <Typography component={`span`}>0</Typography>
          </MUI.SummaryListFlex>
          <MUI.SummaryListFlex>
            <Typography component={`p`}>Tax</Typography>
            <Typography component={`span`}>$4.99</Typography>
          </MUI.SummaryListFlex>

          <hr />

          <MUI.SummaryListFlex sx={{ mb: 4 }}>
            <Typography component={`p`}>Total</Typography>
            <Typography component={`span`}>$53.99</Typography>
          </MUI.SummaryListFlex>

          <Button variant="contained" fullWidth={true}>
            Proceed with payment <NextIcon sx={{ ml: 3, fontSize: "1rem" }} />
          </Button>
        </MUI.SummaryListContainer>

        <MUI.SummaryNoteContainer>
          <Typography component={"p"}>
            By continuting, you accept to our Terms of Services and Privacy
            Policy. Please note that payments are non-refundable
          </Typography>
        </MUI.SummaryNoteContainer>
      </MUI.PricePaymentContainerBox>
    </MUI.PricePaymentSummaryContainer>
  );
}

export default PricePaymentSummary;

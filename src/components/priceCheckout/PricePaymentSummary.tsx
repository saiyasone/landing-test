import * as MUI from "styles/priceCheckoutStyle";
import Typography from "@mui/material/Typography";
import { Button, MenuItem, useMediaQuery } from "@mui/material";
import NextIcon from "@mui/icons-material/EastSharp";
import SelectStyled from "components/SelectStyled";
import { useState } from "react";
import { useSelector } from "react-redux";
import { paymentState } from "stores/features/paymentSlice";

export interface PaymentProp {
  _id: string;
  status: string;
  name: string;
  annualPrice: number;
  monthlyPrice: number;
  packageId: string;
}

type Props = {
  onNext?: () => void;
};

function PricePaymentSummary({ onNext }: Props) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [selectPayment, setSelectPayment] = useState("month");
  const paymentSelector = useSelector(paymentState);
  const dataPackage = paymentSelector.packageIdData;

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
                value={"month"}
                sx={{
                  ...(isMobile && {
                    minHeight: "20px",
                    fontSize: "0.7rem",
                  }),
                }}
              >
                Monthly
              </MenuItem>
              <MenuItem
                value={"year"}
                sx={{
                  ...(isMobile && {
                    minHeight: "20px",
                    fontSize: "0.7rem",
                  }),
                }}
              >
                Year
              </MenuItem>
            </SelectStyled>
          </MUI.SummaryTitle>

          <MUI.SummaryBoxPriceBody>
            <Typography variant="h2">
              $
              {selectPayment === "month"
                ? dataPackage?.monthlyPrice
                : dataPackage?.annualPrice}
              <Typography component={"span"}>/{selectPayment}</Typography>{" "}
            </Typography>
          </MUI.SummaryBoxPriceBody>

          <MUI.SummaryButton>vShare Pro</MUI.SummaryButton>
        </MUI.PricePaymentSummaryBoxPrice>

        <MUI.SummaryListContainer>
          <MUI.SummaryListFlex>
            <Typography component={`p`}>Subscription</Typography>
            <Typography component={`span`}>
              $
              {selectPayment === "month"
                ? dataPackage?.monthlyPrice
                : dataPackage?.annualPrice}
            </Typography>
          </MUI.SummaryListFlex>
          <MUI.SummaryListFlex>
            <Typography component={`p`}>Coupon Discount</Typography>
            <Typography component={`span`}>0</Typography>
          </MUI.SummaryListFlex>
          <MUI.SummaryListFlex>
            <Typography component={`p`}>Tax</Typography>
            <Typography component={`span`}>$0</Typography>
          </MUI.SummaryListFlex>

          <hr />

          <MUI.SummaryListFlex sx={{ mb: 4 }}>
            <Typography component={`p`}>Total</Typography>
            <Typography component={`span`}>
              $
              {selectPayment === "month"
                ? dataPackage?.monthlyPrice
                : dataPackage?.annualPrice}
            </Typography>
          </MUI.SummaryListFlex>

          {paymentSelector.paymentSelect === "visa" && (
            <Button
              variant="contained"
              fullWidth={true}
              onClick={() => {
                onNext?.();
              }}
            >
              Proceed with 2 checkout{" "}
              <NextIcon sx={{ ml: 3, fontSize: "1rem" }} />
            </Button>
          )}
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

import { Grid, Paper } from "@mui/material";
import { Fragment, useEffect } from "react";
import PricePaymentForm from "./PricePaymentForm";
import PricePaymentSummary from "./PricePaymentSummary";
import {
  PricePaymentContainer,
  PricePaymentContainerBox,
} from "styles/priceCheckoutStyle";
import { useDispatch } from "react-redux";
import { setPaymentSteps } from "stores/features/paymentSlice";

type Prop = {
  onNext?: () => void;
};

function PricePayment({ onNext }: Prop) {
  // redux
  const dispatch = useDispatch();

  const handlePaymentTwoCheckout = () => {};

  useEffect(() => {
    // dispatch(
    //   setPaymentSteps({
    //     number: 1,
    //     value: true,
    //   }),
    // );
  }, [dispatch]);

  return (
    <Fragment>
      <PricePaymentContainer sx={{ boxShadow: 3 }}>
        <Paper
          sx={{
            mt: (theme) => theme.spacing(3),
            boxShadow: (theme) => theme.baseShadow.primary,
            flex: "1 1 0%",
          }}
        >
          <Grid item container>
            <Grid item lg={7} md={7} sm={12}>
              <PricePaymentContainerBox>
                <PricePaymentForm />
              </PricePaymentContainerBox>
            </Grid>
            <Grid item lg={5} md={5} sm={12}>
              <PricePaymentSummary
                onNext={() => {
                  onNext?.();
                  // handlePaymentTwoCheckout();
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </PricePaymentContainer>
    </Fragment>
  );
}

export default PricePayment;

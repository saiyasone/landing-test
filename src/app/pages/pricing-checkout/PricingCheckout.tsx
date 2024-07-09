import { Fragment } from "react";
import PricePayment from "components/priceCheckout/PricePayment";
// import PriceSignUp from "components/priceCheckout/PriceSignUp";
// import PriceConfirmation from "components/priceCheckout/PriceConfirm";
import { PricingCheckoutContainer } from "styles/priceCheckoutStyle";
import PricePaymentStepper from "components/priceCheckout/PricePaymentStepper";
// import PriceSignUp from "components/priceCheckout/PriceSignUp";

function PricingCheckout() {
  return (
    <Fragment>
      <PricingCheckoutContainer>
        <PricePaymentStepper />
        <PricePayment />
        {/* <PriceSignUp /> */}
        {/* <PriceConfirmation /> */}
      </PricingCheckoutContainer>
    </Fragment>
  );
}

export default PricingCheckout;

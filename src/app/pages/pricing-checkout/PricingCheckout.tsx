import PricePayment from "components/priceCheckout/PricePayment";
import PriceConfirmation from "components/priceCheckout/PriceConfirm";
import {
  PricingCheckoutBoxContainer,
  PricingCheckoutContainer,
} from "styles/priceCheckoutStyle";
import PricePaymentStepper from "components/priceCheckout/PricePaymentStepper";
import PriceSignUp from "components/priceCheckout/PriceSignUp";

function PricingCheckout() {
  return (
    <PricingCheckoutBoxContainer>
      <PricingCheckoutContainer>
        <PricePaymentStepper />
        <PricePayment />
        {/* <PriceSignUp /> */}
        {/* <PriceConfirmation /> */}
      </PricingCheckoutContainer>
    </PricingCheckoutBoxContainer>
  );
}

export default PricingCheckout;

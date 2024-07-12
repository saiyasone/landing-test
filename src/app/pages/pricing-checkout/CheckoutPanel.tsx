import PriceConfirmation from "components/priceCheckout/PriceConfirm";
import PricePayment from "components/priceCheckout/PricePayment";
import PriceSignUp from "components/priceCheckout/PriceSignUp";
import React, { createRef } from "react";
import { useDispatch } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { setActiveStep } from "stores/features/paymentSlice";

function CheckoutPanel(props) {
  let step: any = null;
  const transitonRef = createRef<any>();

  // redux
  const dispatch = useDispatch();

  switch (props.activeStep) {
    case 0:
      step = (
        <PriceSignUp
          onNext={() => {
            dispatch(setActiveStep(1));
          }}
        />
      );
      break;
    case 1:
      step = (
        <PricePayment
          onNext={() => {
            dispatch(setActiveStep(2));
          }}
        />
      );
      break;

    case 2:
      step = <PriceConfirmation />;
      break;

    default:
      step = null;
  }

  return (
    <TransitionGroup
      style={{
        position: "relative",
      }}
    >
      <CSSTransition
        key={props.activeStep}
        classNames="fade"
        timeout={props.duration}
        nodeRef={transitonRef}
      >
        <div
          ref={transitonRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            {step}
          </div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default CheckoutPanel;

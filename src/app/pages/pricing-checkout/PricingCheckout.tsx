import { useParams } from "react-router-dom";
import PricePayment from "components/priceCheckout/PricePayment";
import PriceConfirmation from "components/priceCheckout/PriceConfirm";
import {
  PricingCheckoutBoxContainer,
  PricingCheckoutContainer,
} from "styles/priceCheckoutStyle";
import PricePaymentStepper from "components/priceCheckout/PricePaymentStepper";
import PriceSignUp from "components/priceCheckout/PriceSignUp";
import { useDispatch, useSelector } from "react-redux";
import {
  paymentState,
  setActivePaymentId,
  setActiveStep,
  setPackageData,
  setPackageIdData,
} from "stores/features/paymentSlice";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { createRef, useEffect } from "react";
import "styles/step-animation.css";
import { decryptDataLink } from "utils/secure.util";
import useManagePublicPackages from "hooks/useManagePublicPackage";
import usePackageFilter from "hooks/usePackageFilter";

function PricingCheckout() {
  const duration = 500;

  // params
  const params = useParams<{ id: string }>();

  // redux
  const { activeStep } = useSelector(paymentState);
  const dispatch = useDispatch();

  // hooks
  const filter = usePackageFilter();
  const packagesData = useManagePublicPackages({ filter: filter.data });

  const PricingCheckoutProcess = () => {
    let step: any = null;
    const transitonRef = createRef<any>();

    switch (activeStep) {
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
          key={activeStep}
          classNames="fade"
          timeout={duration}
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
  };

  useEffect(() => {
    if (packagesData.data?.length > 0) {
      dispatch(setPackageData(packagesData.data));
    }
  }, [packagesData.data, dispatch]);

  useEffect(() => {
    if (params.id) {
      const packageDataId = decryptDataLink(params.id || "");
      dispatch(setActivePaymentId(packageDataId));

      if (packagesData.data) {
        const result = packagesData.data?.find(
          (packData) => packData?._id === packageDataId,
        );

        dispatch(setPackageIdData(result));
    }
    }
  }, [params, dispatch, packagesData.data]);

  return (
    <PricingCheckoutBoxContainer>
      <PricingCheckoutContainer>
        <PricePaymentStepper />

        {PricingCheckoutProcess()}
      </PricingCheckoutContainer>
    </PricingCheckoutBoxContainer>
  );
}

export default PricingCheckout;

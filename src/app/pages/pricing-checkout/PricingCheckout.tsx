import { useParams } from "react-router-dom";
import PricePayment from "components/priceCheckout/PricePayment";
import PriceConfirmation from "components/priceCheckout/PriceConfirm";
import {
  PricingCheckoutBoxContainer,
  PricingCheckoutContainer,
} from "styles/priceCheckoutStyle";
import PriceSignUp from "components/priceCheckout/PriceSignUp";
import { useDispatch, useSelector } from "react-redux";
import {
  paymentState,
  setActivePaymentId,
  setPackageData,
  setPackageIdData,
} from "stores/features/paymentSlice";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { createRef, useEffect } from "react";
import "styles/step-animation.css";
import { decryptDataLink } from "utils/secure.util";
import useManagePublicPackages from "hooks/useManagePublicPackage";
import usePackageFilter from "hooks/usePackageFilter";
import StepV1 from "components/StepV1";

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
        step = <PriceSignUp />;
        break;
      case 1:
        step = <PricePayment />;
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
        <StepV1 active="account" />
        {/* <PricePaymentStepper /> */}

        {PricingCheckoutProcess()}
      </PricingCheckoutContainer>
    </PricingCheckoutBoxContainer>
  );
}

export default PricingCheckout;

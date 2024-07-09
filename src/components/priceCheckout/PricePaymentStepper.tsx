import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, useMediaQuery } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import StepperCompnent from "components/Step";
import { paymentState, setActiveStep } from "stores/features/paymentSlice";
import * as MUI from "styles/stepper.style";

// Icons for steppers
import AccountIcon from "@mui/icons-material/Receipt";
import PaymentIcon from "@mui/icons-material/Payment";
import ConfirmIcon from "@mui/icons-material/ConfirmationNumber";

function PricePaymentStepper() {
  const isMobile = useMediaQuery("(max-width:768px)");

  const dispatch = useDispatch();
  const { activeStep, paymentSteps, packageType, ...paymentSelector } =
    useSelector(paymentState);

  return (
    <Fragment>
      <MUI.PricingCheckoutContainer>
        <MUI.PricingCheckoutHeader>
          <Box
            sx={{
              width: "100%",
              minHeight: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...(isMobile && {
                padding: 5,
                justifyContent: "flex-start",
              }),
            }}
          >
            <StepperCompnent
              handleStep={(step) => dispatch(setActiveStep(step))}
              activeStepState={[activeStep, setActiveStep]}
              stepperProps={{
                connector: (
                  <>
                    {!isMobile && (
                      <ChevronRight
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "calc(-35% + 20px)",
                          right: "calc(35% + 20px)",
                          transform: "translateY(-60%)",
                        }}
                      />
                    )}
                  </>
                ),
                steps: ["Account", "Payment", "Confirmation"],
                isCompletedSteps: [
                  paymentSteps[0],
                  paymentSteps[1],
                  paymentSteps[2],
                ],
                icons: {
                  1: <AccountIcon />,
                  2: <PaymentIcon />,
                  3: <ConfirmIcon />,
                },
              }}
              stepProps={{
                sx: {
                  width: "180px",
                },
              }}
            />
          </Box>
        </MUI.PricingCheckoutHeader>
      </MUI.PricingCheckoutContainer>
    </Fragment>
  );
}

export default PricePaymentStepper;

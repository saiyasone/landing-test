import { useMediaQuery, Typography } from "@mui/material";
import AccountIcon from "@mui/icons-material/AccountBox";
import PaymentIcon from "@mui/icons-material/Payments";

import * as MUI from "styles/stepper.style";
import { ChevronRight } from "@mui/icons-material";

type Props = {
  // account, payment, success
  active: string;
};

function StepV1({ active }: Props) {
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <MUI.PricingCheckoutContainer>
      <MUI.PricingCheckoutHeader>
        <MUI.StepCheckoutBox isMobile={isMobile}>
          <MUI.StepperStyledContainer>
            <MUI.StepperStyledBoxContainer>
              <MUI.StepperStyledBoxLeft>
                <MUI.StepperStyledBoxIcon
                  isActive={active === "account" && true}
                >
                  <AccountIcon />
                </MUI.StepperStyledBoxIcon>
                <MUI.StepperStyledBoxTitle>
                  <Typography component={"p"}>Account</Typography>
                  <Typography component={"span"}>Account Detail</Typography>
                </MUI.StepperStyledBoxTitle>
              </MUI.StepperStyledBoxLeft>
              <MUI.StepperStyledBoxRight>
                <ChevronRight />
              </MUI.StepperStyledBoxRight>
            </MUI.StepperStyledBoxContainer>

            <MUI.StepperStyledBoxContainer>
              <MUI.StepperStyledBoxLeft>
                <MUI.StepperStyledBoxIcon
                  isActive={active === "payment" && true}
                >
                  <PaymentIcon />
                </MUI.StepperStyledBoxIcon>
                <MUI.StepperStyledBoxTitle>
                  <Typography component={"p"}>Payment</Typography>
                  <Typography component={"span"}>Enter information</Typography>
                </MUI.StepperStyledBoxTitle>
              </MUI.StepperStyledBoxLeft>
              <MUI.StepperStyledBoxRight>
                <ChevronRight />
              </MUI.StepperStyledBoxRight>
            </MUI.StepperStyledBoxContainer>

            <MUI.StepperStyledBoxContainer>
              <MUI.StepperStyledBoxLeft>
                <MUI.StepperStyledBoxIcon
                  isActive={active === "confirm" && true}
                >
                  <PaymentIcon />
                </MUI.StepperStyledBoxIcon>
                <MUI.StepperStyledBoxTitle>
                  <Typography component={"p"}>Success</Typography>
                  <Typography component={"span"}>Payment Detail</Typography>
                </MUI.StepperStyledBoxTitle>
              </MUI.StepperStyledBoxLeft>
            </MUI.StepperStyledBoxContainer>
          </MUI.StepperStyledContainer>
        </MUI.StepCheckoutBox>
      </MUI.PricingCheckoutHeader>
    </MUI.PricingCheckoutContainer>
  );
}

export default StepV1;

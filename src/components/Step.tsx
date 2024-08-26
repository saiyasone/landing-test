import { StepLabel, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import { stepLabelClasses } from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { styled as muiStyled } from "@mui/system";
import * as React from "react";
import { StepperHeaderContainer } from "styles/priceCheckoutStyle";

// const CustomStepIconRoot = muiStyled("div")(({ theme, ownerState }) => ({
const CustomStepIconRoot = muiStyled("div")({
  zIndex: 1,
  color: "#fff",
  width: 100,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  // alignItems: "center",
});

function CustomStepIcon(props) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const { active, completed, className } = props;
  const theme = useTheme();
  return (
    <CustomStepIconRoot
      {...props}
      sx={{
        ...props.sx,
        ...(isMobile && {
          justifyContent: "flex-start",
        }),
        width: "100%",
      }}
      ownerState={{ completed, active }}
      className={className}
    >
      <Box>
        {React.cloneElement(props.icons[String(props.icon)], {
          style: {
            ...((completed || active) && {
              backgroundColor: theme.palette.primaryTheme!.main,
              color: theme.palette.primaryTheme!.main,
            }),
            color: "#ccc",
          },
        })}
      </Box>
      <StepperHeaderContainer>
        <Typography component={`p`}>{props?.label?.title} </Typography>
        <Typography component={`span`}>{props?.label?.subtitle} </Typography>
      </StepperHeaderContainer>
    </CustomStepIconRoot>
  );
}

const StepperCompnent = (props) => {
  const { isCompletedSteps, ...stepperProps } = props.stepperProps || {};
  const isMobile = useMediaQuery("(max-width:900px)");
  const theme = useTheme();
  const [activeStep, setActiveStep] = props.activeStepState;
  const [completed, setCompleted] = React.useState({});
  const totalSteps = () => {
    return stepperProps?.steps?.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <>
      <Stepper
        {...{
          ...(isMobile && {
            orientation: "vertical",
          }),
        }}
        alternativeLabel
        activeStep={activeStep}
        {...stepperProps}
        connector={stepperProps.connector}
        sx={{
          height: "100%",
          alignItems: "center",
          ...(isMobile && {
            rowGap: 5,
            maxWidth: "600px",
          }),
        }}
      >
        {stepperProps.steps?.map((label, index) => (
          <Step
            key={index}
            completed={completed[index]}
            sx={{
              display: "flex",
              alignItems: "center",
              ...props.stepProps.sx,
            }}
          >
            <StepLabel
              color="inherit"
              componentsProps={{
                label: {
                  style: {
                    marginTop: 0,
                    height: "35px",
                  },
                },
              }}
              StepIconComponent={(stepLabelProps) => (
                <CustomStepIcon
                  label={label}
                  {...props.stepIconProps}
                  {...{
                    ...stepLabelProps,
                    icons: stepperProps?.icons,
                  }}
                  {...(!(
                    completed[index] ||
                    activeStep === index ||
                    !isCompletedSteps[index]
                  ) && {
                    sx: {
                      cursor: "pointer",
                    },
                    onClick: () => props.handleStep(index),
                  })}
                />
              )}
              sx={{
                [`.${stepLabelClasses.completed},.${stepLabelClasses.active}`]:
                  {
                    color: `${theme.palette.primaryTheme!.main} !important`,
                    ".step-button": {
                      color: `${theme.palette.primaryTheme!.main} !important`,
                    },
                  },
                ...(isMobile && {
                  flexDirection: "row !important",
                }),
              }}
            />
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment></React.Fragment>
        )}
      </div>
    </>
  );
};

export default StepperCompnent;

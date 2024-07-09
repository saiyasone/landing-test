import React, { Fragment } from "react";
import * as MUI from "styles/priceCheckoutStyle";
import Typography from "@mui/material/Typography";
import { Button, TextField } from "@mui/material";
import { Formik } from "formik";
import ContinuteIcon from "@mui/icons-material/ArrowForward";
import GoogleIcon from "assets/images/googleIcon.png";

function PriceSignUp() {
  const handleSubmitForm = async (values: any) => {
    console.log(values);
  };

  return (
    <Fragment>
      <MUI.PriceCheckoutSignUpFormContainer>
        <MUI.PriceCheckoutSignUpContainer>
          <MUI.PriceCheckoutSignUpHeader>
            <Typography variant="h2">Create your account</Typography>
            <Typography variant="h4">
              Already have one?{" "}
              <Typography href="/" component={"a"}>
                Log in
              </Typography>
            </Typography>
          </MUI.PriceCheckoutSignUpHeader>
          <Formik initialValues={{ email: "" }} onSubmit={handleSubmitForm}>
            {({ values, touched, errors, handleChange, handleSubmit }) => (
              <MUI.PriceCheckoutSignUpForm onSubmit={handleSubmit}>
                <MUI.PriceCheckoutLabel>Email</MUI.PriceCheckoutLabel>
                <TextField
                  type="email"
                  name="email"
                  size="small"
                  placeholder="Email"
                  variant="outlined"
                  fullWidth={true}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  onChange={handleChange}
                  value={values.email}
                />

                <MUI.PriceCheckoutAction>
                  <Button
                    variant="contained"
                    type="submit"
                    size="small"
                    fullWidth={true}
                  >
                    Continue{" "}
                    <ContinuteIcon
                      sx={{ ml: 2, verticalAlign: "middle", fontSize: "1rem" }}
                    />
                  </Button>
                </MUI.PriceCheckoutAction>
              </MUI.PriceCheckoutSignUpForm>
            )}
          </Formik>

          <MUI.PriceCheckoutSignUpLineFlex>
            <MUI.PriceCheckoutSignUpLine />
            <Typography component={`p`}>or</Typography>
            <MUI.PriceCheckoutSignUpLine />
          </MUI.PriceCheckoutSignUpLineFlex>

          <MUI.PriceCheckoutSignUpFooter>
            <MUI.GoogleSignUpButton>
              <img src={GoogleIcon} alt="google-icon" />
              Continute with Google
            </MUI.GoogleSignUpButton>

            <MUI.PriceCheckoutPrivacy>
              <Typography variant="h5">
                By creating an account, you agree to our{" "}
                <Typography href="/" component={`a`}>
                  Terms of Service
                </Typography>{" "}
                and{" "}
                <Typography href="/" component={`a`}>
                  Privacy && Cookie Statement.
                </Typography>
              </Typography>
            </MUI.PriceCheckoutPrivacy>
          </MUI.PriceCheckoutSignUpFooter>
        </MUI.PriceCheckoutSignUpContainer>
      </MUI.PriceCheckoutSignUpFormContainer>
    </Fragment>
  );
}

export default PriceSignUp;

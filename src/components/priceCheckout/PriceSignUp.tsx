import { Fragment, useEffect, useState } from "react";
import * as MUI from "styles/priceCheckoutStyle";
import Typography from "@mui/material/Typography";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import ContinuteIcon from "@mui/icons-material/ArrowForward";
import GoogleIcon from "assets/images/googleIcon.png";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setPaymentSteps } from "stores/features/paymentSlice";
import { ENV_KEYS } from "constants/env.constant";
import axios from "axios";
import { useMutation } from "@apollo/client";
import { USER_SIGNUP } from "api/graphql/secure.graphql";
import useManageGraphqlError from "hooks/useManageGraphqlError";
import { errorMessage } from "utils/alert.util";

type Prop = {
  onNext?: () => void;
};

function PriceSignUp({ onNext }: Prop) {
  const [errorEmail, setErrorEmail] = useState("");
  const [isError, setIsError] = useState(false);

  const validateForm = yup.object().shape({
    email: yup.string().required("Email is required").email("Email is invalid"),
    password: yup.string().required("Password is required"),
  });

  // hooks
  const manageGraphQLError = useManageGraphqlError();

  // graphql
  const [register] = useMutation(USER_SIGNUP);

  // redux
  const dispatch = useDispatch();

  const handleSubmitForm = async (values: any) => {
    // try {
    //   const responseIp = await axios.get(ENV_KEYS.VITE_APP_LOAD_GETIP_URL);
    //   const signUpUser = await register({
    //     variables: {
    //       input: {
    //         email: values.email,
    //         password: values.password,
    //         ip: responseIp.data,
    //       },
    //     },
    //   });
    //   if (signUpUser?.data?.signup?._id) {
    //     const user = {
    //       email: values.email,
    //     };
    //     localStorage.setItem("sessions", JSON.stringify(user));
    //     setIsError(false);
    //     onNext?.();
    //   }
    // } catch (error: any) {
    //   const cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
    //   if (cutErr === "") {
    //     setErrorEmail(values.email);
    //     setIsError(true);
    //   } else {
    //     errorMessage(
    //       manageGraphQLError.handleErrorMessage(cutErr as string) || "",
    //       3000,
    //     );
    //   }
    // }
    onNext?.();
  };

  useEffect(() => {
    // dispatch(
    //   setPaymentSteps({
    //     number: 0,
    //     value: true,
    //   }),
    // );
  }, [dispatch]);

  return (
    <Fragment>
      <MUI.PriceCheckoutSignUpFormContainer>
        <MUI.PriceCheckoutSignUpContainer>
          <MUI.PriceCheckoutSignUpHeader>
            <Typography variant="h2">Create your account</Typography>
            <Typography variant="h4">
              Already have one?{" "}
              <Typography
                href={`${ENV_KEYS.VITE_APP_URL_REDIRECT_CLIENT_PAGE}auth/sign-in`}
                component={"a"}
              >
                Log in
              </Typography>
            </Typography>
          </MUI.PriceCheckoutSignUpHeader>
          <Formik
            initialValues={{ email: "zard@gmail.com", password: "" }}
            validationSchema={validateForm}
            onSubmit={handleSubmitForm}
          >
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
                <MUI.PriceCheckoutLabel sx={{ mt: 3 }}>
                  Password
                </MUI.PriceCheckoutLabel>
                <TextField
                  type="password"
                  name="password"
                  size="small"
                  placeholder="Password"
                  variant="outlined"
                  fullWidth={true}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  onChange={handleChange}
                  value={values.password}
                />

                <MUI.PriceCheckoutAction>
                  <Button
                    variant="contained"
                    type="submit"
                    size="small"
                    sx={{ py: 1.5 }}
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

          {isError && (
            <MUI.PriceCheckoutSignUpErrorContainer>
              <Typography variant="h6">
                An account using{" "}
                <strong>{errorEmail || "zeed@gmail.com"}</strong> already
                exists.{" "}
                <Typography
                  component={`a`}
                  href={`${ENV_KEYS.VITE_APP_URL_REDIRECT_CLIENT_PAGE}auth/sign-in`}
                >
                  Log in
                </Typography>{" "}
                instead, or try another email.
              </Typography>
            </MUI.PriceCheckoutSignUpErrorContainer>
          )}

          <MUI.PriceCheckoutSignUpLineFlex sx={{ mt: 4 }}>
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
                <Typography
                  href="/terms-conditions"
                  target="_blank"
                  component={`a`}
                >
                  Terms of Service
                </Typography>{" "}
                and{" "}
                <Typography
                  href="/privacy-policy"
                  target="_blank"
                  component={`a`}
                >
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

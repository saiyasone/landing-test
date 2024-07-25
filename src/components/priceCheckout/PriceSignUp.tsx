import { Fragment, useState } from "react";
import * as MUI from "styles/priceCheckoutStyle";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Formik } from "formik";
import ContinuteIcon from "@mui/icons-material/ArrowForward";
import * as yup from "yup";
import { ENV_KEYS } from "constants/env.constant";
import axios from "axios";
import { useMutation } from "@apollo/client";
import { USER_SIGNUP } from "api/graphql/secure.graphql";
import useManageGraphqlError from "hooks/useManageGraphqlError";
import { errorMessage } from "utils/alert.util";
import StepV1 from "components/StepV1";
import { useNavigate, useParams } from "react-router-dom";

function PriceSignUp() {
  const [errorEmail, setErrorEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = yup.object().shape({
    email: yup.string().required("Email is required").email("Email is invalid"),
  });

  // router
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();

  // hooks
  const manageGraphQLError = useManageGraphqlError();

  // graphql
  const [register] = useMutation(USER_SIGNUP);

  const handleSubmitForm = async (values: any) => {
    setIsLoading(true);
    try {
      const responseIp = await axios.get(ENV_KEYS.VITE_APP_LOAD_GETIP_URL);
      const signUpUser = await register({
        variables: {
          input: {
            email: values.email,
            ip: responseIp.data,
          },
        },
      });
      if (signUpUser?.data?.signup?._id) {
        const user = {
          email: values.email,
        };
        localStorage.setItem("sessions", JSON.stringify(user));
        setIsError(false);
        setTimeout(() => {
          setIsLoading(false);
          navigate(`/pricing/payment/${paramId}`);
        }, 1000);
      }
    } catch (error: any) {
      setTimeout(() => {
        setIsLoading(false);
        localStorage.removeItem("sessions");
        const cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
        if (cutErr === "User or email already registered") {
          setErrorEmail(values.email);
          setIsError(true);
        } else {
          errorMessage(
            manageGraphQLError.handleErrorMessage(cutErr as string) || "",
            3000,
          );
        }
      }, 1000);
    }
  };

  return (
    <Fragment>
      <StepV1 active="account" />
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
            initialValues={{ email: "" }}
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

                <MUI.PriceCheckoutAction>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    size="small"
                    sx={{ py: 1.5 }}
                    fullWidth={true}
                    loading={isLoading}
                  >
                    Continue{" "}
                    <ContinuteIcon
                      sx={{ ml: 2, verticalAlign: "middle", fontSize: "1rem" }}
                    />
                  </LoadingButton>
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

          {/* <MUI.PriceCheckoutSignUpLineFlex sx={{ mt: 4 }}>
            <MUI.PriceCheckoutSignUpLine />
            <Typography component={`p`}>or</Typography>
            <MUI.PriceCheckoutSignUpLine />
          </MUI.PriceCheckoutSignUpLineFlex> */}

          <MUI.PriceCheckoutSignUpFooter>
            {/* <MUI.GoogleSignUpButton>
              <img src={GoogleIcon} alt="google-icon" />
              Continute with Google
            </MUI.GoogleSignUpButton> */}

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

import { motion } from "framer-motion";
import React from "react";
import { useInView } from "react-intersection-observer";

// material ui
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TelegramIcon from "@mui/icons-material/Telegram";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as yup from "yup";

// components

// functions
import { useMutation } from "@apollo/client";
import { MUTATION_CONTACT } from "api/graphql/support.graphql";
import { mapAnimation } from "constants/animation.constant";
import { errorMessage, successMessage } from "utils/alert.util";
import { Formik } from "formik";
import useManageGraphqlError from "hooks/useManageGraphqlError";

// css
const ContactContainer = styled(Container)(({ theme }) => ({
  marginTop: "4rem",
  display: "flex",
  textAlign: "center",
  padding: "4rem 0",
  justifyContent: "space-between",
  [theme.breakpoints.up("sm")]: {
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    padding: "4rem 1rem",
    marginTop: "2rem",
  },
}));

const BoxContactUs = styled(Box)(({ theme }) => ({
  width: "48%",
  padding: "2rem 0",
  border: "1px solid #17766B",
  borderRadius: "5px",
  [theme.breakpoints.up("sm")]: {
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
  },

  [theme.breakpoints.down("sm")]: {
    border: "none",
    width: "100%",
    order: -1,
  },
}));

const ContainerContactUs = styled(Container)({
  display: "flex",
  textAlign: "start",
  justifyContent: "start",
  flexDirection: "column",
});

const BoxContactUsHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "start",
  justifyContent: "start",
  flexDirection: "column",
  color: "#17766B",
  h1: {
    fontSize: "1.5rem",
    lineHeight: 1.25,
    fontWeight: 600,
    height: "auto",
  },
  p: {
    marginTop: "0.5rem",
    fontSize: "0.9rem",
    fontWeight: 500,
    lineHeight: 1.25,
    height: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    h1: {
      fontSize: "1rem",
      marginBottom: "0",
      padding: "0",
    },
    p: {
      fontSize: "0.8rem",
      margin: "0.5rem 0 0 0",
    },
  },
}));

const BoxShowContactForm = styled("form")(({ theme }) => ({
  margin: "2rem 0",
  [theme.breakpoints.down("sm")]: {
    margin: "1rem 0",
  },
}));

const BoxShowSendMessageBTN = styled(Box)({
  textAlign: "start",
  marginTop: "2rem",
});

const ButtonSendMessage = styled(Button)(({ theme }) => ({
  background: "#17766B",
  color: "#ffffff",
  "&:hover": {
    background: "#17766B",
    color: "#ffffff",
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: "0",
  },
}));

const BoxGetinTouch = styled(Box)(({ theme }) => ({
  width: "50%",
  padding: "2rem",
  display: "flex",
  textAlign: "start",
  justifyContent: "start",
  flexDirection: "column",
  background: "#17766B",
  borderRadius: "5px",
  color: "#ffffff",
  h2: {
    fontSize: "1.5rem",
    lineHeight: 1.25,
    fontWeight: 600,
    height: "auto",
  },
  h6: {
    marginTop: "0.5rem",
    fontSize: "0.9rem",
    fontWeight: 500,
    lineHeight: 1.25,
    height: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "2rem 1rem",
    width: "100%",
    h2: {
      fontSize: "1rem",
      marginBottom: "0",
      padding: "0",
    },
    h6: {
      fontSize: "0.8rem",
      margin: "0.5rem 0 0 0",
    },
  },
}));

const GetinTouchDetail = styled(Box)({
  display: "flex",
  alignItems: "start",
  justifyContent: "start",
  padding: "0.4rem 0",
});

function ContactUs() {
  const theme = createTheme();
  const manageGraphqlError = useManageGraphqlError();

  const validateForm = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Email is required"),
    message: yup.string().required("Message is required"),
  });

  const [createContact] = useMutation(MUTATION_CONTACT);

  const isMobile = useMediaQuery("(max-width: 600px)");
  const { ref: ref7, inView: inView7 } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const handleSubmitContactV1 = async (values, action) => {
    try {
      const contact = await createContact({
        variables: {
          body: {
            name: values.username,
            email: values.email,
            message: values.message,
          },
        },
      });
      if (contact?.data?.createContact?._id) {
        successMessage("Check your email for the respon!!", 3000);
        action?.resetForm();
      }
    } catch (error: any) {
      const cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(
        manageGraphqlError.handleErrorMessage(
          cutErr || "Something wrong please try again !",
        ) as string,
        3000,
      );
    }
  };

  return (
    <ContactContainer>
      <BoxGetinTouch>
        <Typography variant="h2">Let's get in tounch</Typography>
        <Box>
          <Typography sx={{ fontSize: "0.8rem", fontWeight: "500" }}>
            Should you have any questions or encounter any issues, please don't
            hesitate to reach out to us. We are committed to providing the best
            assistance and ensuring your satisfaction. Thank you for considering
            us.
          </Typography>
        </Box>
        <Box>
          <GetinTouchDetail>
            <LocationOnIcon sx={{ fontSize: "18px" }} />
            &nbsp;&nbsp;
            <Typography>
              NongNieng village, Saysettha district and Vientiane Capital.
            </Typography>
          </GetinTouchDetail>
          <GetinTouchDetail>
            <LocalPhoneIcon sx={{ fontSize: "18px" }} />
            &nbsp;&nbsp;
            <Typography>+856 21755789</Typography>
          </GetinTouchDetail>
          <GetinTouchDetail>
            <EmailIcon sx={{ fontSize: "18px" }} />
            &nbsp;&nbsp;
            <Typography>support@vshare.net</Typography>
          </GetinTouchDetail>
        </Box>
      </BoxGetinTouch>
      <BoxContactUs ref={ref7}>
        <ContainerContactUs maxWidth="lg">
          <BoxContactUsHeader>
            <motion.h1
              variants={mapAnimation}
              initial="hidden"
              animate={inView7 ? "show" : "hidden"}
            >
              Send us a Message
            </motion.h1>
            <motion.p
              variants={mapAnimation}
              initial="hidden"
              animate={inView7 ? "show" : "hidden"}
            >
              Your message will be directed to our support team, who will
              respond via the email address you provided.
            </motion.p>
          </BoxContactUsHeader>
          <Formik
            initialValues={{ username: "", email: "", message: "" }}
            validationSchema={validateForm}
            onSubmit={handleSubmitContactV1}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <BoxShowContactForm onSubmit={handleSubmit}>
                <motion.div
                  variants={mapAnimation}
                  initial="hidden"
                  animate={inView7 ? "show" : "hidden"}
                >
                  <Grid container spacing={isMobile ? 2 : 6}>
                    <Grid
                      item
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      sx={{
                        width: "100%",
                        paddingTop: "1rem !important",
                        [theme.breakpoints.down("sm")]: {
                          paddingTop: "0.68rem !important",
                        },
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        name="username"
                        error={Boolean(touched.username && errors.username)}
                        helperText={touched.username && errors.username}
                        value={values.username}
                        onChange={handleChange}
                        InputLabelProps={{
                          style: {
                            fontSize: "0.8rem",
                            color: "#17766B",
                          },
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      sx={{
                        width: "100%",
                        paddingTop: "1rem !important",

                        [theme.breakpoints.down("sm")]: {
                          paddingTop: "0.68rem !important",
                        },
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        name="email"
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                        value={values.email}
                        onChange={handleChange}
                        InputLabelProps={{
                          style: {
                            fontSize: "0.8rem",
                            color: "#17766B",
                          },
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      sx={{
                        width: "100%",
                        paddingTop: "1rem !important",

                        [theme.breakpoints.down("sm")]: {
                          paddingTop: "0.68rem !important",
                        },
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        label="Message"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        name="message"
                        error={Boolean(touched.message && errors.message)}
                        helperText={touched.message && errors.message}
                        value={values.message}
                        onChange={handleChange}
                        InputLabelProps={{
                          style: {
                            fontSize: "0.8rem",
                            color: "#17766B",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <BoxShowSendMessageBTN>
                    <ButtonSendMessage
                      startIcon={<TelegramIcon />}
                      variant="contained"
                      size="large"
                      type="submit"
                      sx={{
                        fontSize: "1rem",
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "0.8rem",
                        },
                      }}
                    >
                      Send Message
                    </ButtonSendMessage>
                  </BoxShowSendMessageBTN>
                </motion.div>
              </BoxShowContactForm>
            )}
          </Formik>
        </ContainerContactUs>
      </BoxContactUs>
    </ContactContainer>
  );
}

export default ContactUs;

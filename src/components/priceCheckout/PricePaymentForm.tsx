import React, { ChangeEvent, Fragment, useRef } from "react";
import * as MUI from "styles/priceCheckoutStyle";
import Typography from "@mui/material/Typography";
import { Formik } from "formik";
import { Button, Grid, TextField } from "@mui/material";
import * as yup from "yup";
import bcelIcon from "assets/images/bcel.jpg";
import visaIcon from "assets/images/Visa.png";
import QrCode from "react-qr-code";
import useBcelSubscirption from "hooks/useBcelSubscription";
import { useDispatch, useSelector } from "react-redux";
import { paymentState, setPaymentSelect } from "stores/features/paymentSlice";

function PricePaymentForm() {
  // const [paymentTab, setPaymentTab] = useState("bcel");
  const qrCodeRef = useRef<any>(null);

  // redux
  const paymentSelector = useSelector(paymentState);
  const dispatch = useDispatch();

  const validateSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    country: yup.string().required("Country is required"),
    zipCode: yup.string().required("Zip code is required"),
  });

  const bcelOnePay = useBcelSubscirption();

  const handlePaymentTab = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setPaymentSelect(event.target.value));
  };

  const handleSubmitForm = (values: any) => {
    console.log(values);
  };

  const handleDownloadQRCode = () => {
    const svgDocument = qrCodeRef.current;
    if (!svgDocument) return;
    const svgContent = new XMLSerializer().serializeToString(svgDocument);
    const svgBlob = new Blob([`${svgContent}`], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bcel-one.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <React.Fragment>
      <MUI.PricePaymentFormContainer>
        <MUI.PricePaymentHeader>Choose how to pay</MUI.PricePaymentHeader>
        <MUI.PricePaymentSelector>
          <input
            id="bcel-ref"
            type="radio"
            name="payment-selected"
            hidden={true}
            checked={paymentSelector.paymentSelect === "bcel"}
            onChange={handlePaymentTab}
            value="bcel"
          />
          <MUI.PricePaymentLabel
            className="payment-selector"
            htmlFor="bcel-ref"
          >
            <MUI.PricePaymentLabelCircle className="payment-circle" />
            <MUI.PricePaymentBox>
              <img src={bcelIcon} alt="bcel-icon" />
              <Typography component={"p"}>BCEL One</Typography>
            </MUI.PricePaymentBox>
          </MUI.PricePaymentLabel>
          <input
            id="visa-ref"
            type="radio"
            name="payment-selected"
            hidden={true}
            checked={paymentSelector.paymentSelect === "visa"}
            onChange={handlePaymentTab}
            value="visa"
          />
          <MUI.PricePaymentLabel
            className="payment-selector"
            htmlFor="visa-ref"
          >
            <MUI.PricePaymentLabelCircle className="payment-circle" />

            <MUI.PricePaymentBox>
              <img src={visaIcon} alt="visa-icon" />
              <Typography component={`p`}>Credit card</Typography>
            </MUI.PricePaymentBox>
          </MUI.PricePaymentLabel>
        </MUI.PricePaymentSelector>

        <MUI.PricePaymentQRCode>
          <Typography variant="h4">
            QR Code (Account number: 1122 2255 8899 6633)
          </Typography>
        </MUI.PricePaymentQRCode>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            country: "",
            zipCode: "",
          }}
          validationSchema={validateSchema}
          onSubmit={handleSubmitForm}
        >
          {({ values, touched, errors, handleChange, handleSubmit }) => (
            <Fragment>
              <Grid item container spacing={5}>
                <Grid item lg={5} md={5} sm={5} xs={12}>
                  <MUI.PricePaymentQRCodeContainer>
                    <QrCode
                      style={{ width: "100%" }}
                      ref={qrCodeRef}
                      value={bcelOnePay.qrCode || ""}
                      viewBox={`0 0 256 256`}
                    />
                  </MUI.PricePaymentQRCodeContainer>

                  <Button
                    variant="contained"
                    type="button"
                    fullWidth
                    onClick={handleDownloadQRCode}
                  >
                    Download QR Code
                  </Button>
                </Grid>
                <Grid item lg={7} md={7} sm={7} xs={12}>
                  <form onSubmit={handleSubmit}>
                    <MUI.PricePaymentForm>
                      <MUI.PriceCheckoutLabel>
                        First name
                      </MUI.PriceCheckoutLabel>
                      <TextField
                        type="text"
                        name="firstName"
                        size="small"
                        placeholder="First name"
                        variant="outlined"
                        fullWidth={true}
                        error={Boolean(touched.firstName && errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        onChange={handleChange}
                        value={values.firstName}
                      />
                    </MUI.PricePaymentForm>

                    <MUI.PricePaymentForm>
                      <MUI.PriceCheckoutLabel>Last name</MUI.PriceCheckoutLabel>
                      <TextField
                        type="text"
                        name="lastName"
                        size="small"
                        placeholder="Last name"
                        variant="outlined"
                        fullWidth={true}
                        error={Boolean(touched.lastName && errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        onChange={handleChange}
                        value={values.lastName}
                      />
                    </MUI.PricePaymentForm>

                    <MUI.PricePaymentForm>
                      <MUI.PriceCheckoutLabel>Country</MUI.PriceCheckoutLabel>
                      <TextField
                        type="country"
                        name="country"
                        size="small"
                        placeholder="country"
                        variant="outlined"
                        fullWidth={true}
                        error={Boolean(touched.country && errors.country)}
                        helperText={touched.country && errors.country}
                        onChange={handleChange}
                        value={values.country}
                      />
                    </MUI.PricePaymentForm>

                    <MUI.PricePaymentForm>
                      <MUI.PriceCheckoutLabel>Zip code</MUI.PriceCheckoutLabel>
                      <TextField
                        type="zipCode"
                        name="zipCode"
                        size="small"
                        placeholder="zip code"
                        variant="outlined"
                        fullWidth={true}
                        error={Boolean(touched.zipCode && errors.zipCode)}
                        helperText={touched.zipCode && errors.zipCode}
                        onChange={handleChange}
                        value={values.zipCode}
                      />
                    </MUI.PricePaymentForm>
                  </form>
                </Grid>
              </Grid>
            </Fragment>
          )}
        </Formik>
      </MUI.PricePaymentFormContainer>
    </React.Fragment>
  );
}

export default PricePaymentForm;

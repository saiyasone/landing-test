import React, {
  ChangeEvent,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import * as MUI from "styles/priceCheckoutStyle";
import Typography from "@mui/material/Typography";
import { Button, Grid, TextField } from "@mui/material";

import bcelIcon from "assets/images/bcel.jpg";
import visaIcon from "assets/images/Visa.png";
import QrCode from "react-qr-code";
import useBcelSubscirption from "hooks/useBcelSubscription";
import { useDispatch, useSelector } from "react-redux";
import {
  paymentState,
  setActiveStep,
  setPaymentProfile,
  setPaymentSelect,
} from "stores/features/paymentSlice";
import { SUBSCRIPTION_BCEL_ONE_SUBSCRIPTION } from "api/graphql/payment.graphql";
import { useSubscription } from "@apollo/client";

function PricePaymentForm() {
  const [formField, setFormField] = useState({
    firstName: "",
    lastName: "",
    country: "",
    zipCode: "",
  });
  const qrCodeRef = useRef<any>(null);

  // redux
  const paymentSelector = useSelector(paymentState);
  const dispatch = useDispatch();

  const bcelOnePay = useBcelSubscirption();

  const _bcelOneSubscription = useSubscription(
    SUBSCRIPTION_BCEL_ONE_SUBSCRIPTION,
    {
      variables: { transactionId: bcelOnePay.transactionId },
      onComplete: () => {
        console.log("on complete");
        dispatch(
          setPaymentProfile({
            firstName: formField.firstName,
            lastName: formField.lastName,
            country: formField.country,
            zipCode: formField.zipCode,
          }),
        );
        dispatch(setActiveStep(2));
      },
      onData: () => {
        console.log("on data");
        dispatch(
          setPaymentProfile({
            firstName: formField.firstName,
            lastName: formField.lastName,
            country: formField.country,
            zipCode: formField.zipCode,
          }),
        );
        dispatch(setActiveStep(2));
      },
    },
  );

  const handlePaymentTab = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setPaymentSelect(event.target.value));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormField((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  useEffect(() => {
    const handleSubscription = async () => {
      if (bcelOnePay.transactionId) {
        //
      }
    };

    handleSubscription();
  }, [bcelOnePay]);

  useEffect(() => {
    if (formField) {
      // dispatch(
      //   setPaymentProfile({
      //     firstName: formField.firstName,
      //     lastName: formField.lastName,
      //     country: formField.country,
      //     zipCode: formField.zipCode,
      //   }),
      // );
    }
  }, [formField, dispatch]);

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
          <Typography variant="h4">QR Code</Typography>
        </MUI.PricePaymentQRCode>

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
              <MUI.PricePaymentForm>
                <MUI.PriceCheckoutLabel>First name</MUI.PriceCheckoutLabel>
                <TextField
                  type="text"
                  name="firstName"
                  size="small"
                  placeholder="First name"
                  variant="outlined"
                  fullWidth={true}
                  onChange={handleChange}
                  value={formField.firstName}
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
                  onChange={handleChange}
                  value={formField.lastName}
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
                  onChange={handleChange}
                  value={formField.country}
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
                  onChange={handleChange}
                  value={formField.zipCode}
                />
              </MUI.PricePaymentForm>
            </Grid>
          </Grid>
        </Fragment>
      </MUI.PricePaymentFormContainer>
    </React.Fragment>
  );
}

export default PricePaymentForm;

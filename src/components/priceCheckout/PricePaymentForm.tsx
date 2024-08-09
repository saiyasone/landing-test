import React, {
  Fragment,
  useEffect,
  useRef,
} from "react";
import * as MUI from "styles/priceCheckoutStyle";
import { Box, Button, Grid } from "@mui/material";

import QrCode from "react-qr-code";
import useBcelSubscirption from "hooks/useBcelSubscription";
import { useDispatch } from "react-redux";
import {
  setActiveStep,
  setPaymentProfile,
  setRecentPayment,
} from "stores/features/paymentSlice";
import {
  SUBSCRIPTION_BCEL_ONE_SUBSCRIPTION,
  SUBSCRIPTION_BCEL_ONE_SUBSCRIPTION_QR,
} from "api/graphql/payment.graphql";
import { useSubscription } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { errorMessage } from "utils/alert.util";

function PricePaymentForm() {
  const navigate = useNavigate();
  // const [formField, setFormField] = useState({
  //   firstName: "",
  //   lastName: "",
  //   country: "",
  //   zipCode: "",
  // });
  const qrCodeRef = useRef<any>(null);

  // redux
  const dispatch = useDispatch();

  const bcelOnePay = useBcelSubscirption();

  const _bcelOneSubscription = useSubscription(
    SUBSCRIPTION_BCEL_ONE_SUBSCRIPTION,
    {
      variables: { transactionId: bcelOnePay.transactionId },
      onComplete: () => {
        dispatch(setActiveStep(2));
      },
      onData: () => {
        console.log("on data output after==>>");
        dispatch(
          setPaymentProfile({
            // firstName: formField.firstName,
            // lastName: formField.lastName,
            // country: formField.country,
            // zipCode: formField.zipCode,
          }),
        );

        dispatch(setActiveStep(2));
      },
    },
  );

  ///QR payment
  const _bcelOneSubscriptionQr = useSubscription(
    SUBSCRIPTION_BCEL_ONE_SUBSCRIPTION_QR,
    {
      variables: { transactionId: bcelOnePay.transactionId },
      onComplete: () => {
        dispatch(
          setPaymentProfile({
            // firstName: formField.firstName,
            // lastName: formField.lastName,
            // country: formField.country,
            // zipCode: formField.zipCode,
          }),
        );

        if (localStorage["sessionKey"]) {
          localStorage.removeItem("sessionkey");
        }

        dispatch(setActiveStep(2));
      },
      onData: ({ data }: { data: any }) => {
        dispatch(setRecentPayment(data?.data?.subscribeBcelOneSubscriptionQr));

        if (localStorage["sessionKey"]) {
          localStorage.removeItem("sessionKey");
        }

        if (
          data?.data?.subscribeBcelOneSubscriptionQr?.message.toUpperCase() ===
          "SUCCESS"
        ) {
          setTimeout(() => {
            navigate(`/pricing/confirm-payment`);
          }, 1000);
        } else {
          errorMessage(
            data?.subscribeBcelOneSubscriptionQr?.message ||
              data?.data?.subscribeBcelOneSubscriptionQr?.error,
          );
        }
      },
    },
  );

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

  // useEffect(() => {
  //   if (formField) {
  //     dispatch(
  //       setPaymentProfile({
  //         firstName: formField.firstName,
  //         lastName: formField.lastName,
  //         country: formField.country,
  //         zipCode: formField.zipCode,
  //       }),
  //     );
  //   }
  // }, [formField, dispatch]);

  return (
    <React.Fragment>
      <MUI.PricePaymentFormContainer>
        <Fragment>
          <Grid item container spacing={5}>
            <Grid item xs={12}>
              <MUI.PricePaymentQRCodeContainer>
                {bcelOnePay.qrCode && (
                  <QrCode
                    style={{ width: "150px", height:"150px", border: '1px solid gray', padding: '7px', borderRadius: '7px'}}
                    ref={qrCodeRef}
                    value={bcelOnePay.qrCode || ""}
                    viewBox={`0 0 256 256`}
                    // fgColor="#17766B"
                  />
                )}
              </MUI.PricePaymentQRCodeContainer>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={5}
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleDownloadQRCode}
                >
                  Download QR Code
                </Button>
              </Box>
            </Grid>
            {/* <Grid item lg={7} md={7} sm={7} xs={12}>
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
            </Grid> */}
          </Grid>
        </Fragment>
      </MUI.PricePaymentFormContainer>
    </React.Fragment>
  );
}

export default PricePaymentForm;

import * as MUI from "styles/priceCheckoutStyle";
import Typography from "@mui/material/Typography";
import { Button, MenuItem, useMediaQuery } from "@mui/material";
import NextIcon from "@mui/icons-material/EastSharp";
import SelectStyled from "components/SelectStyled";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  paymentState,
  setActivePaymentId,
  setPackageIdData,
  setPaymentType,
  setPaymentTypeSummary,
} from "stores/features/paymentSlice";
import ButtonSelectStyled from "components/ButtonSelectStyled";
import { useNavigate } from "react-router-dom";

import { decryptDataLink, encryptDataLink } from "utils/secure.util";
import { useSubscription } from "@apollo/client";
import { SUBSCRIPTION_TWO_CHECKOUT } from "api/graphql/payment.graphql";
export interface PaymentProp {
  _id: string;
  status: string;
  name: string;
  annualPrice: number;
  monthlyPrice: number;
  packageId: string;
}

function PricePaymentSummary() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [pricePayment, setPricePayment] = useState("");
  const [menuPackage, setMenuPackage] = useState("");
  const [emailLogin, setEmailLogin] = useState("");
  // const [selectPayment, setSelectPayment] = useState("monthly");
  const [dataPackages, setDataPackages] = useState<any[]>([]);
  const paymentSelector = useSelector(paymentState);
  const dataPackage = paymentSelector.packageIdData;
  const selectPayment = paymentSelector.paymentTypeSummary;

  // params
  const navigate = useNavigate();
  const { data: dataSubscription } = useSubscription(
    SUBSCRIPTION_TWO_CHECKOUT,
    {
      variables: {
        code: emailLogin,
      },
    },
  );

  // redux
  const dispatch = useDispatch();

  const handleSubmitSubscription = async () => {};

  useEffect(() => {
    const emailJson = localStorage.getItem("sessions");
    if (emailJson) {
      const emailParse = JSON.parse(emailJson);
      if (emailParse?.email) {
        setEmailLogin(emailParse.email);
      }
    }
  }, []);

  useEffect(() => {
    if (paymentSelector.packageIdData) {
      setMenuPackage(paymentSelector.packageIdData._id);
      setPricePayment(
        selectPayment === "monthly"
          ? String(paymentSelector.packageIdData?.monthlyPrice)
          : String(paymentSelector.packageIdData?.annualPrice || "0"),
      );
    }
  }, [paymentSelector.packageIdData, selectPayment]);

  useEffect(() => {
    if (paymentSelector.packageData) {
      const results = Array.from(paymentSelector.packageData);
      const data = results.filter((el: any) => el.category !== "free");
      setDataPackages(data);
    }
  }, [paymentSelector.packageData]);

  useEffect(() => {
    if (menuPackage) {
      const encode = encryptDataLink(menuPackage);
      const decode = decryptDataLink(encode);
      dispatch(setActivePaymentId(decode));

      if (dataPackages) {
        const result = dataPackages.find((el: any) => el._id === decode);
        dispatch(setPackageIdData(result));
      }

      navigate("/pricing/payment/" + encode);
    }
  }, [menuPackage, dispatch, dataPackages]);

  useEffect(() => {
    if (dataSubscription) {
      console.log("Ok");
      const result = dataSubscription.twoCheckoutSubscription?.message;
      console.log(result);
      if (result === "SUCCESS") {
        navigate("/pricing/confirm-payment");
      }
    }
  }, [dataSubscription]);

  useEffect(() => {
    if (selectPayment) {
      dispatch(setPaymentType(selectPayment));
    }
  }, [selectPayment, dispatch]);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <MUI.PricePaymentSummaryContainer>
      <MUI.PricePaymentContainerBox>
        <MUI.PricePaymentSummaryHeader>
          <Typography variant="h2">Order Summary</Typography>
          <Typography component={`p`}>Email: {emailLogin} </Typography>
        </MUI.PricePaymentSummaryHeader>

        <MUI.PricePaymentSummaryBoxPrice>
          <MUI.SummaryTitle>
            <Typography component={`p`}>Your plan</Typography>
            <SelectStyled
              SelectDisplayProps={{
                sx: {
                  overflow: "unset !important",
                },
              }}
              value={selectPayment}
              variant="outlined"
              onChange={(e) => {
                dispatch(setPaymentTypeSummary(e.target.value || ""));
              }}
              sx={{
                overflow: "unset",
              }}
            >
              <MenuItem
                value={"monthly"}
                sx={{
                  ...(isMobile && {
                    minHeight: "20px",
                    fontSize: "0.7rem",
                    textAlign: "center",
                  }),
                }}
              >
                Monthly
              </MenuItem>
              <MenuItem
                value={"year"}
                sx={{
                  ...(isMobile && {
                    minHeight: "20px",
                    fontSize: "0.7rem",
                  }),
                }}
              >
                Year
              </MenuItem>
            </SelectStyled>
          </MUI.SummaryTitle>

          <MUI.SummaryBoxPriceBody>
            <Typography variant="h2">
              ${pricePayment}
              <Typography component={"span"}>/{selectPayment}</Typography>{" "}
            </Typography>
          </MUI.SummaryBoxPriceBody>

          <ButtonSelectStyled
            SelectDisplayProps={{
              sx: {
                overflow: "unset !important",
              },
            }}
            value={menuPackage}
            variant="outlined"
            onChange={(e) => {
              setMenuPackage(e.target.value);
            }}
            sx={{
              overflow: "unset",
            }}
          >
            {dataPackages.map((item, index) => (
              <MenuItem
                key={index}
                value={item._id}
                sx={{
                  // color: "#17766B",
                  ...(isMobile && {
                    minHeight: "20px",
                    fontSize: "1rem",
                  }),
                }}
              >
                Vshare {item.name}
              </MenuItem>
            ))}
          </ButtonSelectStyled>
        </MUI.PricePaymentSummaryBoxPrice>

        <MUI.SummaryListContainer>
          <MUI.SummaryListFlex>
            <Typography component={`p`}>Subscription</Typography>
            <Typography component={`span`}>${pricePayment}</Typography>
          </MUI.SummaryListFlex>
          <MUI.SummaryListFlex>
            <Typography component={`p`}>Coupon Discount</Typography>
            <Typography component={`span`}>0</Typography>
          </MUI.SummaryListFlex>
          <MUI.SummaryListFlex>
            <Typography component={`p`}>Tax</Typography>
            <Typography component={`span`}>$0</Typography>
          </MUI.SummaryListFlex>

          <hr />

          <MUI.SummaryListFlex sx={{ mb: 4 }}>
            <Typography component={`p`}>Total</Typography>
            <Typography component={`span`}>
              $
              {selectPayment === "monthly"
                ? dataPackage?.monthlyPrice
                : dataPackage?.annualPrice}
            </Typography>
          </MUI.SummaryListFlex>

          {paymentSelector.paymentSelect === "visa" && (
            <Button variant="contained" fullWidth={true} onClick={() => {}}>
              Proceed with 2 checkout{" "}
              <NextIcon sx={{ ml: 3, fontSize: "1rem" }} />
            </Button>
          )}
        </MUI.SummaryListContainer>

        <MUI.SummaryNoteContainer>
          <Typography component={"p"}>
            By continuting, you accept to our Terms of Services and Privacy
            Policy. Please note that payments are non-refundable
          </Typography>
        </MUI.SummaryNoteContainer>
      </MUI.PricePaymentContainerBox>
    </MUI.PricePaymentSummaryContainer>
  );
}

export default PricePaymentSummary;

import * as MUI from "styles/priceCheckoutStyle";
import Typography from "@mui/material/Typography";
import { Button, MenuItem, useMediaQuery } from "@mui/material";
import NextIcon from "@mui/icons-material/EastSharp";
import SelectStyled from "components/SelectStyled";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  COUNTRIES,
  PAYMENT_METHOD,
  paymentState,
  setActivePaymentId,
  setExchangeRate,
  setPackageIdData,
  setPaymentType,
  setPaymentTypeSummary,
} from "stores/features/paymentSlice";
import ButtonSelectStyled from "components/ButtonSelectStyled";
import { useNavigate } from "react-router-dom";

import { decryptDataLink, encryptDataLink } from "utils/secure.util";
import { useLazyQuery, useSubscription } from "@apollo/client";
import { BCEL_EXCHANGE_RATE, SUBSCRIPTION_TWO_CHECKOUT } from "api/graphql/payment.graphql";
import { func_exchange_calc } from "utils/exchange.calc";
export interface PaymentProp {
  _id: string;
  status: string;
  name: string;
  annualPrice: number;
  monthlyPrice: number;
  packageId: string;
}

function PricePaymentSummary() {
  const [XChangeRate] = useLazyQuery(BCEL_EXCHANGE_RATE);
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
      const price = selectPayment === "monthly"
      ? paymentSelector.packageIdData?.monthlyPrice
      : paymentSelector.packageIdData?.annualPrice;


      setPricePayment(
        () => {
          if(paymentSelector.country === COUNTRIES.LAOS && (paymentSelector.paymentSelect === PAYMENT_METHOD.bcelOne || paymentSelector.activePaymentMethod === PAYMENT_METHOD.bcelOne)){
            const total = (func_exchange_calc(paymentSelector.currencySymbol, price, paymentSelector.exchangeRate));
            return total.toLocaleString();
          }

          return price.toLocaleString();
        }
      );
    }
  }, [paymentSelector.packageIdData, selectPayment, paymentSelector.exchangeRate, paymentSelector.country, paymentSelector.currencySymbol, paymentSelector.paymentSelect]);

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
      const result = dataSubscription.twoCheckoutSubscription?.message;
      
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

  useEffect(()=>{
    const getExchangeRate = async() => {
      await XChangeRate().then((data: any)=>{
        if(data?.data && data?.data?.bceloneLoadExchangeRate?.result_code === 200){
          const rate = data?.data?.bceloneLoadExchangeRate?.info?.rows[0]?.Sell_Rates;
          if(rate> 0){
            dispatch(
              setExchangeRate(rate)
            );
          }
        }
      })
    };

    getExchangeRate();
  }, [paymentSelector.exchangeRate])

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
              {paymentSelector.currencySymbol}{pricePayment}
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
            <Typography component={`span`}>{paymentSelector.currencySymbol}{pricePayment}</Typography>
          </MUI.SummaryListFlex>
          <MUI.SummaryListFlex>
            <Typography component={`p`}>Coupon Discount</Typography>
            <Typography component={`span`}>{paymentSelector.currencySymbol}0</Typography>
          </MUI.SummaryListFlex>
          <MUI.SummaryListFlex>
            <Typography component={`p`}>Tax</Typography>
            <Typography component={`span`}>{paymentSelector.currencySymbol}0</Typography>
          </MUI.SummaryListFlex>

          <hr />

          <MUI.SummaryListFlex sx={{ mb: 4 }}>
            <Typography component={`p`}>Total</Typography>
            <Typography component={`span`}>
              {paymentSelector.currencySymbol}
              {selectPayment === "monthly"
                ? (paymentSelector.country === COUNTRIES.LAOS && paymentSelector.paymentSelect === "bcel" ? func_exchange_calc(paymentSelector.currencySymbol, Number(dataPackage?.monthlyPrice), paymentSelector.exchangeRate) : (Number(dataPackage.monthlyPrice))).toLocaleString()
                : (paymentSelector.country === COUNTRIES.LAOS && paymentSelector.paymentSelect === "bcel" ? func_exchange_calc(paymentSelector.currencySymbol,Number(dataPackage?.annualPrice), paymentSelector.exchangeRate) : (Number(dataPackage.annualPrice))).toLocaleString()}
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

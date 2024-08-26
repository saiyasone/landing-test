import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment/moment";
import { useEffect } from "react";
import { BiTimeFive } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { paymentState, setPaymentSteps } from "stores/features/paymentSlice";
import PackagePlan from "./PackagePlan";
import { PricePackageConfirmation } from "styles/priceCheckoutStyle";
// import PackagePlan from "../PackagePlan";

const ConfirmationContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: 32,
});

const ContentWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: 32,
  padding: theme.spacing(6),
  borderRadius: 4,
  border: "1px solid #DBDADE",
}));

const PriceConfirmation: React.FC<any> = (_props) => {
  const dispatch = useDispatch();
  const { currencySymbol, paymentProfile, ...paymentSelector }: any =
    useSelector(paymentState);
  const totalPrice = `${currencySymbol}${(
    paymentSelector.total - paymentSelector.couponAmount
  ).toLocaleString()}`;

  useEffect(() => {
    // dispatch(
    //   setPaymentSteps({
    //     number: 2,
    //     value: true,
    //   }),
    // );
  }, [dispatch]);

  return (
    <PricePackageConfirmation>
      <ConfirmationContainer
        sx={{
          mx: 10,
          mb: 10,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 4,
            alignItems: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
            }}
          >
            Thank You! 😇
          </Typography>
          <Typography variant="body1">
            Your order #{paymentSelector.recentPayment?.paymentId} has been
            placed!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontSize: "13px",
              fontWeight: "500",
              lineHeight: "20px",
            }}
          >
            <span>
              Thank you for your purchase! Your package includes access to
              Vshare
            </span>
            <span>
              detail: I have sent the payment slip and package details to your
              email. Please let me know if you have any questions or concerns.
            </span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <BiTimeFive />
            <span
              style={{
                fontWeight: 600,
              }}
            >
              Time placed
            </span>
            :{" "}
            {paymentSelector.recentPayment?.orderedAt &&
              moment(paymentSelector.recentPayment?.orderedAt).format(
                "DD-MM-YYYY h:mm A",
              )}
          </Typography>
        </Box>
        <ContentWrapper>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
            }}
          >
            Package Plans
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: 2,
            }}
          >
            <PackagePlan />
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Typography
              variant="h6"
              className="title"
              sx={{
                mr: 20,
                fontWeight: 600,
              }}
            >
              Total
            </Typography>
            <Typography component="div" className="context" variant="h6">
              {totalPrice}
            </Typography>
          </Box>
        </ContentWrapper>
        <ContentWrapper>
          <Typography
            variant="body1"
            sx={{ display: "flex", flexDirection: "column", maxWidth: 250 }}
          >
            <span>
              {paymentProfile.firstName} {paymentProfile.lastName}{" "}
            </span>
            <span>
              {`${paymentProfile.country} && ${paymentProfile.zipCode}`}
            </span>
            <span>{paymentProfile.email}</span>
          </Typography>
        </ContentWrapper>
      </ConfirmationContainer>
    </PricePackageConfirmation>
  );
};

export default PriceConfirmation;

import { Grid, Paper } from "@mui/material";
import { Fragment, useEffect } from "react";
import PricePaymentForm from "./PricePaymentForm";
import PricePaymentSummary from "./PricePaymentSummary";
import {
  PricePaymentContainer,
  PricePaymentContainerBox,
} from "styles/priceCheckoutStyle";
import StepV1 from "components/StepV1";
import useManagePublicPackages from "hooks/useManagePublicPackage";
import usePackageFilter from "hooks/usePackageFilter";
import { useDispatch, useSelector } from "react-redux";
import { paymentState, setCalculatePrice, setPackageData, setPackageIdData } from "stores/features/paymentSlice";
import { useParams } from "react-router-dom";
import { decryptDataLink } from "utils/secure.util";

function PricePayment() {
  const paymentSelector = useSelector(paymentState);
  const filter = usePackageFilter();
  const managePackages = useManagePublicPackages({ filter: filter.data });

  const { id } = useParams();

  // redux
  const dispatch = useDispatch();

  useEffect(() => {
    if (managePackages.data && managePackages.data?.length > 0) {
      const decodeParam = decryptDataLink(id);
      const result = managePackages.data?.find((el) => el._id === decodeParam);
      dispatch(setPackageIdData(result));
      dispatch(setPackageData(managePackages.data));
    }
  }, [managePackages.data, dispatch]);

  useEffect(() => {
    if (paymentSelector.packageData && paymentSelector.activePackageId) {
      dispatch(setCalculatePrice());
    }
  }, [paymentSelector.packageData, paymentSelector.activePackageId]);

  // useEffect(() => {
  //   if (packages.data) {
  //     dispatch(setPackageData(packages.data));
  //   }
  // }, [packages.data, dispatch]);

  return (
    <Fragment>
      <StepV1 active="payment" />
      <PricePaymentContainer sx={{ boxShadow: 3 }}>
        <Paper
          sx={{
            mt: (theme) => theme.spacing(3),
            boxShadow: (theme) => theme.baseShadow.primary,
            flex: "1 1 0%",
          }}
        >
          <Grid item container>
            <Grid item lg={7} md={7} sm={12}>
              <PricePaymentContainerBox>
                <PricePaymentForm />
              </PricePaymentContainerBox>
            </Grid>
            <Grid item lg={5} md={5} sm={12}>
              <PricePaymentSummary />
            </Grid>
          </Grid>
        </Paper>
      </PricePaymentContainer>
    </Fragment>
  );
}

export default PricePayment;

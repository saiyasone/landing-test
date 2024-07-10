import { Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { PACKAGE_TYPE, paymentState } from "stores/features/paymentSlice";

const PackagePlan = () => {
  const { currencySymbol, ...paymentSelector }: any = useSelector(paymentState);
  const theme = useTheme();
  const currentPackageType = paymentSelector.activePackageType;
  const packagePrice =
    (currentPackageType === PACKAGE_TYPE.annual
      ? paymentSelector.activePackageData.annualPrice
      : paymentSelector.activePackageData.monthlyPrice) || 0;
  return (
    <>
      <Typography
        className="package-plan-title"
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        {currentPackageType === PACKAGE_TYPE.annual ? (
          <>
            Annual&nbsp;
            <span
              style={{
                color: theme.palette.primaryTheme!.main,
              }}
            >
              (Save up to 10%)
            </span>
          </>
        ) : (
          <>Manual</>
        )}
      </Typography>
      <Typography variant="body1">
        Standard - For small to medium businesses
      </Typography>
      <Typography variant="body1" fontSize={13}>
        {currencySymbol}
        {packagePrice?.toLocaleString()}{" "}
        {currentPackageType === PACKAGE_TYPE.annual ? "x 1 year" : "x 1 month"}
      </Typography>
    </>
  );
};

export default PackagePlan;

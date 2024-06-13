import { Box, Typography } from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import warningSvg from "assets/images/warning.svg";
import BaseDialogV1 from "components/BaseDialogV1";
import NormalButton from "../../components/NormalButton";

const DialogWarningPackageBoby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(5),
}));

const DialogWarningPackage = (props) => {
  return (
    <BaseDialogV1
      {...props}
      dialogProps={{
        PaperProps: {
          sx: {
            overflowY: "initial",
            maxWidth: "650px",
          },
        },
        sx: {
          columnGap: "20px",
        },
      }}
      dialogContentProps={{
        sx: {
          backgroundColor: "white !important",
          borderRadius: "6px",
          padding: (theme) => `${theme.spacing(5)}`,
        },
      }}
      onClose={() => props.onClose()}
    >
      <DialogWarningPackageBoby>
        <Typography
          component="div"
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            component="img"
            src={warningSvg}
            style={{
              width: "125px",
              height: "125px",
            }}
          />
        </Typography>
        <Typography
          variant="h3"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: (theme) => theme.spacing(7),
            color: (theme) => theme.palette.primaryTheme!.brown(),
          }}
        >
          Upgrade Plan
        </Typography>
        <Typography
          component="div"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            rowGap: (theme) => theme.spacing(3),
            fontWeight: "bold",
            marginBottom: (theme) => theme.spacing(7),
            color: (theme) => theme.palette.primaryTheme!.brown(),
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
            }}
          >
            You need to upgrade to use this function
          </Typography>
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: (theme) => theme.spacing(4),
          }}
        >
          {props.label}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            columnGap: (theme) => theme.spacing(3),
          }}
        >
          <Box
            sx={{
              display: "flex",
              columnGap: (theme) => theme.spacing(3),
            }}
          >
            <NormalButton
              sx={{
                width: "auto",
                padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                borderRadius: (theme) => theme.spacing(1),
                backgroundColor: (theme) => theme.palette.primaryTheme!.main,
                color: "white !important",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                props.onConfirm();
              }}
            >
              {props.isPackageExist !== null ? (
                <>{props.isPackageExist ? "Renew" : "Upgrade now"}</>
              ) : (
                <>...</>
              )}
            </NormalButton>
            <NormalButton
              onClick={() => props.onClose()}
              sx={{
                width: "auto",
                padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                borderRadius: (theme) => theme.spacing(1),
                backgroundColor: "rgba(0,0,0,0.1)",
                color: "rgba(0,0,0,0.5)",
              }}
            >
              Cancel
            </NormalButton>
          </Box>
        </Box>
      </DialogWarningPackageBoby>
    </BaseDialogV1>
  );
};

export default DialogWarningPackage;

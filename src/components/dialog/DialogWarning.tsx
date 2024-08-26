import * as Mui from "styles/filedrop.style";

// component and functions

//mui component and style
import { Typography } from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import BaseDialogV1 from "components/BaseDialogV1";

const DialogPreviewFileV1Boby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(3),
  "& .MuiDialogActions-root": {
    display: "none",
  },
}));

const DialogWarning = (props) => {
  return (
    <BaseDialogV1
      {...props}
      dialogProps={{
        PaperProps: {
          sx: {
            overflowY: "initial",
            maxWidth: "500px",
          },
        },
      }}
      dialogContentProps={{
        sx: {
          backgroundColor: "white !important",
          borderRadius: "6px",
          padding: (theme) => `${theme.spacing(8)} ${theme.spacing(6)}`,
        },
      }}
    >
      <DialogPreviewFileV1Boby>
        <Mui.FiledropContainer>
          <Mui.ShowHeaderDetail>
            <Typography variant="h3">{props.title}</Typography>
            <Typography variant="h6">{props.description}</Typography>
          </Mui.ShowHeaderDetail>
        </Mui.FiledropContainer>
      </DialogPreviewFileV1Boby>
    </BaseDialogV1>
  );
};

export default DialogWarning;

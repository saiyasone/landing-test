import React from "react";

//mui component and style
import { Box, Button } from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import BaseDialogV1 from "components/BaseDialogV1";
import * as htmlToImage from "html-to-image";
import QRCode from "react-qr-code";

const DialogPreviewFileV1Boby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(3),
}));

const DialogPreviewQRcode = (props) => {
  const fileUrl = props?.data;
  const splitedFileUrl = fileUrl.split("/");
  const name = splitedFileUrl[splitedFileUrl.length - 1];
  const ref = React.useRef<HTMLElement | null>();

  const downloadQRcodeAsImage = () => {
    const element = ref.current;
    const style = `
    font-size: 24px;
    background-color: white;
    color: black;
    padding: 2rem;
  `;
    if (element) {
      element.style.cssText = style;

      htmlToImage.toPng(element).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = name;
        link.href = dataUrl;
        link.click();
      });
    }
  };

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
        <Box sx={{ textAlign: "center" }}>
          <h3 style={{ color: "#4B465C" }}>
            Your QR code has been generated successfully!!
          </h3>
          <Box ref={ref}>
            <QRCode
              id="qr-code-canvas"
              value={fileUrl}
              size={200}
              level="H"
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </Box>
          <Button
            sx={{
              background: "#ffffff",
              color: "#17766B",
              fontSize: "14px",
              padding: "2px 10px",
              borderRadius: "20px",
              border: "1px solid #17766B",
              "&:hover": {
                border: "1px solid #17766B",
                color: "#17766B",
              },
              margin: "1rem 0",
            }}
            onClick={downloadQRcodeAsImage}
          >
            Download QR
          </Button>
        </Box>
      </DialogPreviewFileV1Boby>
    </BaseDialogV1>
  );
};

export default DialogPreviewQRcode;

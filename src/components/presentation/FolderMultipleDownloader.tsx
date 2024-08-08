import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import * as Icon from "assets/icons/icon";
import { Fragment } from "react";
import { convertBytetoMBandGB } from "utils/storage.util";

function FolderMultipleDownload(props) {
  const {
    index,
    folderName,
    folderPassword,
    folderSize,
    isSuccess,
    isHide,
    isMobile,
    setPassword,
    // setGetFolderName,
    setFilePasswords,
    handleDownloadFolder,
  } = props;
  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          minWidth: "150px",
          height: "30px",
        }}
      >
        <Icon.FolderIcon />
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          &nbsp;
          {folderName}&nbsp;
          {convertBytetoMBandGB(folderSize)}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isSuccess[index] ? (
          <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
        ) : isHide[index] ? (
          <CircularProgress
            color="success"
            sx={{ color: "#17766B" }}
            size={isMobile ? "18px" : "22px"}
          />
        ) : (
          <IconButton
            onClick={() => {
              // const folder_name = `${folderName}`;
              setPassword("");
              // setGetFolderName(folder_name);
              setFilePasswords(folderPassword);
              handleDownloadFolder();
            }}
          >
            {!folderPassword ? (
              <DownloadIcon sx={{ color: "#17766B" }} />
            ) : (
              <FileDownloadOffIcon
                sx={{
                  fontSize: isMobile ? "17px" : "22px",
                }}
              />
            )}
          </IconButton>
        )}
      </Box>
    </Fragment>
  );
}

export default FolderMultipleDownload;

import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import * as Icon from "assets/icons/icon";
import { Fragment } from "react";
import { convertBytetoMBandGB } from "utils/storage.util";

function FolderDownloader(props) {
  const {
    folderDownload,
    isSuccess,
    isHide,
    isMobile,
    setPassword,
    setFilePasswords,
    handleDownloadFolder,
    folderSize,
    setIndex,
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
          {folderDownload[0]?.folder_name}&nbsp;
          {convertBytetoMBandGB(folderSize)}
        </Typography>
      </Box>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {isSuccess[1] ? (
          <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
        ) : isHide[1] ? (
          <CircularProgress
            color="success"
            sx={{ color: "#17766B" }}
            size={isMobile ? "18px" : "22px"}
          />
        ) : (
          <IconButton
            onClick={() => {
              setIndex(1);
              setPassword("");
              setFilePasswords(folderDownload[0]?.access_password);
              handleDownloadFolder({
                createdBy: folderDownload[0]?.createdBy,
              });
            }}
          >
            {!folderDownload[0]?.access_password ? (
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

export default FolderDownloader;

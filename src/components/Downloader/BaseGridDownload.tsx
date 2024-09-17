import { Box, IconButton } from "@mui/material";
import React, { Fragment } from "react";
import GridIcon from "@mui/icons-material/AppsOutlined";
import {
  BoxAdsAction,
  BoxAdsContainer,
} from "styles/presentation/presentation.style";
import BaseNormalButton from "components/BaseNormalButton";
import { FaDownload } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

type Props = {
  dataFiles: any[];
  adAlive: number;

  handleClearSelector?: () => void;
  handleToggle?: () => void;
  handleDownloadGridFileAndFolder?: () => void;
};
function BaseGridDownload(props: Props) {
  return (
    <Fragment>
      <IconButton size="small" onClick={props?.handleToggle}>
        <GridIcon />
      </IconButton>
      <Box sx={{ position: "relative" }}>
        {props?.dataFiles?.length > 0 && (
          <Fragment>
            {props?.adAlive > 0 && (
              <BoxAdsContainer>
                <BoxAdsAction sx={{ padding: "2px 10px", fontSize: "10px" }}>
                  {props?.adAlive}
                </BoxAdsAction>
              </BoxAdsContainer>
            )}
          </Fragment>
        )}

        <BaseNormalButton
          title="Download"
          disabled={props?.dataFiles?.length > 0 ? false : true}
          handleClick={props?.handleDownloadGridFileAndFolder}
        >
          <FaDownload fontSize={12} style={{ marginRight: "8px" }} />
        </BaseNormalButton>
      </Box>

      <BaseNormalButton
        title=""
        style={{ padding: "9px 8px" }}
        disabled={props?.dataFiles?.length > 0 ? false : true}
        handleClick={props?.handleClearSelector}
      >
        <FaTimes fontSize={14} />
      </BaseNormalButton>
    </Fragment>
  );
}

export default BaseGridDownload;

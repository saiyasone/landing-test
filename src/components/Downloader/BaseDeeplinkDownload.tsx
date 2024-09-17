import { Button } from "@mui/material";
import { FilBoxBottomContainer } from "app/pages/file-uploader/styles/fileUploader.style";

type Props = {
  platform?: string;
  selectionData: any[];

  onClickOpenApplication?: () => void;
  onClickDownloadData?: () => void;
};
function BaseDeeplinkDownload(props: Props) {
  return (
    <FilBoxBottomContainer>
      <Button
        fullWidth={true}
        variant="contained"
        disabled={props?.selectionData?.length > 0 ? false : true}
        onClick={props.onClickDownloadData}
      >
        Download
      </Button>
      {(props?.platform === "android" || props?.platform === "ios") && (
        <Button
          onClick={props?.onClickOpenApplication}
          fullWidth={true}
          variant="contained"
        >
          Open app
        </Button>
      )}
    </FilBoxBottomContainer>
  );
}

export default BaseDeeplinkDownload;

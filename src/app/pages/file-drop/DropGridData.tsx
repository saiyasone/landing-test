import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Fragment } from "react";
import { convertBytetoMBandGB } from "utils/storage.util";
import QrCode from "@mui/icons-material/QrCode";
import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";

type Props = {
  queryFile?: any[];
  dataFromUrl?: any;
  isSuccess?: any;
  isHide?: any;
  isMobile?: boolean;

  setSelectedRow?: (id: string | number) => void;
  setMultiId?: (id: string | number) => void;
  handleQrCode?: (id: string | number, preview: string) => void;
  handleDownloadFile?: (value: any, index: number, data: any) => void;
};

function DropGridData(props: Props) {
  const {
    queryFile,
    dataFromUrl,
    isHide,
    isMobile,
    isSuccess,

    setMultiId,
    setSelectedRow,
    handleDownloadFile,
    handleQrCode,
  } = props;

  const columns: any = [
    {
      field: "no",
      headerName: "ID",
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "filename",
      headerName: "Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "size",
      headerName: "Size",
      width: 70,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const size = params?.row?.size || 0;
        return <span>{convertBytetoMBandGB(size)}</span>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      width: 70,
      align: "center",
      renderCell: (params) => {
        const status = params?.row?.status || "Inactive";
        return (
          <div style={{ color: "green" }}>
            <Chip
              sx={{
                backgroundColor:
                  status?.toLowerCase() === "active" ? "#DCF6E8" : "#dcf6e8",
                color:
                  status?.toLowerCase() === "active" ? "#4BD087" : "#29c770",
                fontWeight: "bold",
              }}
              label={
                status?.toLowerCase() === "active" ? "" + "Active" : "Inactive"
              }
              size="small"
            />
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        // const status = params?.row?.status || "Inactive";
        // status?.toLowerCase() === "active" &&
        // (userId > 0 ? (
        //   <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
        // ) : (
        //   <>
        //     <Box>
        //       {isSuccess[params?.row?.no] ? (
        //         <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
        //       ) : isHide[params?.row?.no] ? (
        //         <CircularProgress
        //           color="success"
        //           sx={{ color: "#17766B" }}
        //           size={isMobile ? "18px" : "22px"}
        //         />
        //       ) : (
        //         <Tooltip title="Download" placement="top">
        //           <IconButton
        //             onClick={(e) => {
        //               handleDownloadFile(e, 1, params?.row);
        //             }}
        //           >
        //             <DownloadIcon sx={{ ":hover": { color: "#17766B" } }} />
        //           </IconButton>
        //         </Tooltip>
        //       )}
        //     </Box>
        //     <Box
        //       sx={{
        //         "&:hover": {
        //           transform: "scale(1.05)",
        //           cursor: "pointer",
        //         },
        //       }}
        //     >
        //       <QRCode
        //         style={{
        //           backgroundColor: "#fff",
        //           padding: "7px",
        //           borderRadius: "7px",
        //         }}
        //         value={params?.row?.dropUrl}
        //         size={50}
        //         level="H"
        //         fgColor="#000000"
        //         bgColor="#FFFFFF"
        //       />
        //     </Box>
        //   </>
        // ))

        return (
          <Fragment>
            <Box>
              {isSuccess?.[params?.row?.no] ? (
                <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
              ) : isHide?.[params?.row?.no] ? (
                <CircularProgress
                  color="success"
                  sx={{ color: "#17766B" }}
                  size={isMobile ? "18px" : "22px"}
                />
              ) : (
                <Tooltip title="Download" placement="top">
                  <IconButton
                    onClick={(e) => {
                      handleDownloadFile?.(e, params?.row?.no, params?.row);
                    }}
                  >
                    <DownloadIcon sx={{ ":hover": { color: "#17766B" } }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <IconButton
              onClick={() => {
                handleQrCode?.(params?.row, "preview-qr");
              }}
            >
              <QrCode />
            </IconButton>
          </Fragment>
        );
      },
    },
  ];

  return (
    <Fragment>
      <DataGrid
        sx={{
          borderRadius: 0,
          height: "100% !important",
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        }}
        autoHeight
        getRowId={(row) => row?._id}
        rows={queryFile || []}
        columns={columns}
        checkboxSelection={dataFromUrl?.allowMultiples ? true : false}
        disableSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        hideFooter
        onSelectionModelChange={(ids: any) => {
          if (dataFromUrl?.allowMultiples) {
            setSelectedRow?.(ids);
            setMultiId?.(ids);
          }
        }}
      />
      {queryFile!.length > 15 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              padding: (theme) => theme.spacing(4),
            }}
          >
            Showing 1 to 10 of {100} entries
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              padding: (theme) => theme.spacing(4),
              flex: "1 1 0%",
            }}
          ></Box>
        </Box>
      )}
    </Fragment>
  );
}

export default DropGridData;

import React from 'react'
import { FileIcon, defaultStyles } from "react-file-icon";
import * as Mui from "./styles/fileDropDownloader.style";
// material ui
import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DialogShowFiledrop from "components/dialog/DialogShowFiledrop";
import { cutFileName, getFileType } from "utils/file.util";
import { convertBytetoMBandGB } from "utils/storage.util";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import {
    CREATE_DETAIL_ADVERTISEMENT,
    QUERY_ADVERTISEMENT,
  } from "api/graphql/ad.graphql";
  import { UPDATE_FILE_PUBLIC } from "api/graphql/file.graphql";
  import {
    QUERY_FILE_DROP_PUBLIC,
    QUERY_FILE_DROP_PUBLIC_URL,
  } from "api/graphql/fileDrop.graphql";
  import { QUERY_SETTING } from "api/graphql/setting.graphql";
  import { ENV_KEYS } from "constants/env.constant";
  import moment from "moment";
  import { errorMessage, successMessage } from "utils/alert.util";
  import { cutFileName, } from "utils/file.util";



const FiledropContainer = styled(Container)({
    // marginTop: "5rem",
    textAlign: "center",
    // padding: "4rem 0",
  });
  
  const ShowFilesDetail = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem",
    borderRadius: "5px",
    margin: "0.5rem 0",
  });
  
  const UploadArea = styled(Box)(({ theme }) => ({
    padding: "4rem 2rem",
    borderRadius: "6px",
    background: "#ECF4F3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    b: {
      color: "#4B465C",
      fontSize: "1.2rem",
      fontWeight: "600",
      padding: "0 !important",
    },
    p: {
      color: "#4B465C",
      fontSize: "0.8rem",
      fontWeight: "600",
      marginBottom: "1.5rem",
      width: "50%",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "2rem 1rem",
      p: {
        fontSize: "0.8rem",
      },
    },
  }));
  

const DragAndDrop = () => {
    const [files, setFiles] = useState<any[]>([]);
    const [dataIp, setDataIP] = useState("");
    const [status, setStatus] = useState("");
    const [getActionButton, setGetActionButton] = useState<any>();
    const [getAdvertisemment, setGetAvertisement] = useState<any>([]);
    const [usedAds, setUsedAds] = useState<any[]>([]);
    const [lastClickedButton, setLastClickedButton] = useState<any[]>([]);
    const [totalClickCount, setTotalClickCount] = useState(0);
    const [dataFromUrl, setDataFromUrl] = useState<any>({});

    const [getDataButtonDownload, { data: getDataButtonDL }] = useLazyQuery(
        QUERY_SETTING,
        {
        fetchPolicy: "cache-and-network",
        },
    );

    const [createDetailAdvertisement] = useMutation(CREATE_DETAIL_ADVERTISEMENT);

    const [getAdvertisement, { data: getDataAdvertisement }] = useLazyQuery(
        QUERY_ADVERTISEMENT,
        {
        fetchPolicy: "cache-and-network",
        },
    );

    const [getFileDrop, { data: filesData, refetch }] = useLazyQuery(
        QUERY_FILE_DROP_PUBLIC,
    );

    const [getUserByDropUrl, { data: dropData }] = useLazyQuery(
        QUERY_FILE_DROP_PUBLIC_URL,
    );

    const [currentUrl, setCurrentUrl] = useState("");
    // const currentUrl = window.location.href;
    const [updateFileStatus] = useMutation(UPDATE_FILE_PUBLIC);
    const data: any = [];
    const BUNNY_STORAGE_ZONE = ENV_KEYS.VITE_APP_STORAGE_ZONE;
    const ACCESS_KEY = ENV_KEYS.VITE_APP_ACCESSKEY_BUNNY;
    const LOAD_GET_IP_URL = ENV_KEYS.VITE_APP_LOAD_GETIP_URL;

    useEffect(() => {
        const currentUrl = window.location.href;
        const fbclidIndex = currentUrl.indexOf("&fbclid");

        if (fbclidIndex !== -1) {
        const newUrl = currentUrl.slice(0, fbclidIndex);
        window.history.replaceState(null, "", newUrl);

        setCurrentUrl(newUrl);
        } else {
        setCurrentUrl(currentUrl);
        }
    }, []);

    useEffect(() => {
        getDataButtonDownload({
        variables: {
            where: {
            groupName: "file_seeting_landing_page",
            productKey: "ASALPAS",
            },
        },
        });
        getAdvertisement({
        variables: {
            where: {
            status: "active",
            },
        },
        });
        if (getDataButtonDL?.general_settings?.data[0]) {
        setGetActionButton(getDataButtonDL?.general_settings?.data[0]?.action);
        }
        if (getDataAdvertisement?.getAdvertisement?.data[0]) {
        setGetAvertisement(getDataAdvertisement?.getAdvertisement?.data);
        }
    }, [getDataButtonDL, getDataAdvertisement]);


    async function getDataIP() {
        const result = await axios.get(LOAD_GET_IP_URL);

        const resData = await result.data;
        setDataIP(resData);
    }

    useEffect(() => {
        getDataIP();
    }, []);

    const onDrop = useCallback(
        (acceptedFiles) => {
        setFiles([...files, ...acceptedFiles]);
        setOpen(true);
        },
        [files],
    );

    React.useEffect(() => {
        getFileDrop({
        variables: {
            where: {
            dropUrl: currentUrl,
            ip: dataIp,
            status: "active",
            },
        },
        });

        if (filesData?.getFileDrop?.total == null) {
        setQueryFile([]);
        } else {
        setQueryFile(filesData?.getFileDrop?.data || []);
        }
    }, [filesData, currentUrl]);

    React.useEffect(() => {
        getUserByDropUrl({
            variables: {
            where: {
                url: currentUrl,
            },
            },
        });

        const item = dropData?.getPublicFileDropUrl?.data[0];

        if (item?.status == "expired" || !item) {
            setStatus(item?.status);
        }
        if (item?.createdBy?._id > 0) {
            setDataFromUrl(item);
            setUserId(item?.createdBy?._id);
            setNewName(item?.createdBy?.newName);
            setFolderId(item?.folderId?._id);
            setPath(item?.folderId?.path);
            setNewPath(item?.folderId?.newPath);
            setFolderNewName(item?.folderId?.newFolder_name);
        }
        
    }, [dropData, currentUrl, status]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleRemoveAll = () => {
        setFiles([]);
        handleClose();
        refetch();
    };

    const handleDelete = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleUpdateFileStatus = async (_id) => {
        try {
        await updateFileStatus({
            variables: {
            data: {
                dropStatus: "closed",
            },
            where: {
                _id: _id,
            },
            },
        });
        } catch (error) {
        errorMessage("Something wrong. Try again later!", 2000);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    });

    useEffect(() => {
    const updateCountdown = () => {
        const now = moment();
        const expirationTime = moment(dataFromUrl?.expiredAt);
        const duration = moment.duration(expirationTime.diff(now));

        if (duration.asSeconds() <= 0) {
        setTimeLeft('This link has expired');
        return;
        }

        const formattedDate = expirationTime.format('DD/MM/YYYY');
        const formattedTime = `${Math.floor(duration.asHours())}h ${duration.minutes()}m ${duration.seconds()}s`;
        setTimeLeft(`${formattedDate} ${formattedTime}`);
    };

    const intervalId = setInterval(updateCountdown, 1000);
    
    if(dataFromUrl.expiredAt){
        updateCountdown();
    }

    return () => clearInterval(intervalId);
    }, [dataFromUrl?.expiredAt]);
  return (
    <FiledropContainer
            sx={{
              [theme.breakpoints.down("sm")]: {
                padding: "0 1rem",
              },
            }}
          >
            <UploadArea>
              <Typography component="b">
                {dataFromUrl?.title ? dataFromUrl?.title : ""}
              </Typography>
              <Typography component="p">
                {dataFromUrl?.description ? dataFromUrl?.description : ""}
              </Typography>
              <Mui.BoxShowUploadDetail {...getRootProps()}>
                <Box
                  sx={{
                    padding: "0.5rem",
                    borderRadius: "6px",
                    background: "#DFE6E7",
                  }}
                >
                  <FileUploadOutlinedIcon
                    sx={{ fontSize: "30px", color: "#5D596C" }}
                  />
                </Box>

                <Box className="box-drag" sx={{ mt: 4, mb: 2 }}>
                  <Typography component="span">
                    Drag and drop your files here to upload
                  </Typography>
                </Box>
                <Mui.ButtonUpload
                  variant="contained"
                  onClick={() => {
                    setOpen(true);
                    setClickUpload(!clickUpload);
                  }}
                  startIcon={
                    <FileUploadOutlinedIcon
                      sx={{ color: "#fff", verticalAlign: "middle" }}
                    />
                  }
                >
                  Select files
                  <input {...getInputProps()} hidden={true} />
                </Mui.ButtonUpload>
              </Mui.BoxShowUploadDetail>
              <br />
              <Typography component="p" sx={{color:'#e31f09 !important'}}>
                {dataFromUrl?.expiredAt
                  ? 
                  <>
                    <span style={{ color: '#000' }}>This link will expire in: </span>
                    <span style={{ color: '#e31f09', fontWeight: '700', marginLeft: '1rem' }}>{timeLeft.replace(/h|m|s/g, match => `${match}`)}</span>
                  </>
                  : ""
                }
              </Typography>
              {files.map((file, index) => {
                const newFile: any = new File([file.data], file.name, {
                  type: file.type,
                });
                newFile.id = (index + 1).toString();
                newFile.path = file.path;
                newFile.sizeFile = file.size;
                const updatedFile = { file: newFile };
                data.push(updatedFile);
                return <Fragment key={index}></Fragment>;
              })}
              {data.length > 0 ? (
                <DialogShowFiledrop
                  open={open}
                  files={data}
                  onClose={handleClose}
                  onDeleteData={handleDelete}
                  selectMore={{ ...getRootProps() }}
                  onRemoveAll={handleRemoveAll}
                  dataFile={files}
                  openModal={clickUpload}
                  checkSend={() => setFiles([])}
                  userId={userId}
                  newName={newName}
                  folderId={folderId}
                  folderNewname={folderNewName}
                  path={path}
                  newPath={newPath}
                />
              ) : (
                ""
              )}
            </UploadArea>
            {dataFromUrl?.folderId?._id ? (
              ""
            ) : (
              <div>
                {queryFile.length > 0 ? (
                  <>
                    <Box
                      sx={{
                        color: "#4B465C",
                        margin: "2rem 0 0.5rem 0",
                        fontSize: "1.1rem",
                        textAlign: "start",
                        [theme.breakpoints.down("sm")]: {
                          fontSize: "0.8rem",
                        },
                      }}
                    >
                      Anyone with the link will be able to access your file.
                    </Box>
                    <Box
                      sx={{
                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                        borderRadius: "6px",
                        padding: "2rem",
                        [theme.breakpoints.down("sm")]: {
                          marginBottom: "2rem",
                        },
                      }}
                    >
                      {queryFile?.map((val, index) => (
                        <ShowFilesDetail key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "start",
                              justifyContent: "center",
                            }}
                          >
                            <Box sx={{ width: "25px", mr: 2 }}>
                              <FileIcon
                                color="white"
                                extension={getFileType(val.filename)}
                                {...{
                                  ...defaultStyles[
                                    getFileType(val.filename) as string
                                  ],
                                }}
                              />
                            </Box>
                            <Box sx={{ textAlign: "start" }}>
                              <span>
                                {cutFileName(val.filename, 8)}
                              </span>
                              <br />
                              <span>{convertBytetoMBandGB(val.size)}</span>
                            </Box>
                          </Box>
                          {userId > 0 ? (
                            ""
                          ) : (
                            <Box>
                              {isSuccess[index] ? (
                                <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
                              ) : isHide[index] ? (
                                <CircularProgress
                                  color="success"
                                  sx={{ color: "#17766B" }}
                                  size={isMobile ? "18px" : "22px"}
                                />
                              ) : (
                                <Tooltip title="Download" placement="top">
                                  <IconButton
                                    onClick={(e) =>
                                      handleDownloadFile(
                                        e,
                                        index,
                                        val?._id,
                                        val?.filename,
                                        val?.newFilename,
                                      )
                                    }
                                  >
                                    <DownloadIcon
                                      sx={{ ":hover": { color: "#17766B" } }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          )}
                        </ShowFilesDetail>
                      ))}
                    </Box>
                  </>
                ) : (
                  ""
                )}
              </div>
            )}
          </FiledropContainer>
  )
}

export default DragAndDrop
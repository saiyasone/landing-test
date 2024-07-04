import { useLazyQuery, useMutation } from "@apollo/client";
import { styled } from "@mui/material/styles";
import CryptoJS from "crypto-js";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileIcon, defaultStyles } from "react-file-icon";

// components and function
import axios from "axios";
import { NavLink } from "react-router-dom";
import * as Mui from "./styles/fileDropDownloader.style";

// material ui
import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
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
import DialogShowFiledrop from "components/dialog/DialogShowFiledrop";
import { ENV_KEYS } from "constants/env.constant";
import moment from "moment";
import { errorMessage, successMessage } from "utils/alert.util";
import { cutFileName, getFileType } from "utils/file.util";
import { convertBytetoMBandGB } from "utils/storage.util";

const FiledropContainer = styled(Container)({
  marginTop: "5rem",
  textAlign: "center",
  padding: "4rem 0",
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

const ExpiredArea = styled(Box)(({ theme }) => ({
  marginTop: "5rem",
  padding: "10rem 0",
  textAlign: "center",
  h1: { margin: 0, color: "#5D596C" },
  h4: { margin: "0.5rem 0", color: "#6F6B7D" },
  [theme.breakpoints.down("sm")]: {
    padding: "5rem 1rem",
    h1: {
      fontSize: "18px",
    },
  },
}));

function FileDropDownloader() {
  const theme = createTheme();
  const [clickUpload, setClickUpload] = useState(false);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [queryFile, setQueryFile] = useState<any[]>([]);
  const [userId, setUserId] = useState(0);
  const [newName, setNewName] = useState("");
  const [folderId, setFolderId] = useState(null);
  const [dataIp, setDataIP] = useState("");
  const [path, setPath] = useState("");
  const [newPath, setNewPath] = useState("");
  const [folderNewName, setFolderNewName] = useState("");
  const [status, setStatus] = useState("");
  const [getActionButton, setGetActionButton] = useState<any>();
  const [getAdvertisemment, setGetAvertisement] = useState<any>([]);
  const [usedAds, setUsedAds] = useState<any[]>([]);
  const [lastClickedButton, setLastClickedButton] = useState<any[]>([]);
  const [totalClickCount, setTotalClickCount] = useState(0);
  const [isHide, setIsHide] = useState<any>(false);
  const [isSuccess, setIsSuccess] = useState<any>(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
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

  const handleDownloadFile = async (e, index, _id, filename, newFilename) => {
    if (lastClickedButton?.includes(`${_id}`)) {
      e.preventDefault();
      const changeFilename = cutFileName(filename, newFilename);
      try {
        setIsHide((prev) => ({
          ...prev,
          [index]: true,
        }));
        const secretKey = ENV_KEYS.VITE_APP_UPLOAD_SECRET_KEY;
        const headers = {
          accept: "*/*",
          storageZoneName: BUNNY_STORAGE_ZONE,
          isFolder: false,
          path: "public/" + newFilename,
          fileName: CryptoJS.enc.Utf8.parse(newFilename),
          AccessKey: ACCESS_KEY,
        };

        const key = CryptoJS.enc.Utf8.parse(secretKey);
        const iv = CryptoJS.lib.WordArray.random(16);
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(headers), key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
        const cipherText = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
        const ivText = iv.toString(CryptoJS.enc.Base64);
        const encryptedData = cipherText + ":" + ivText;

        const response = await fetch(ENV_KEYS.VITE_APP_DOWNLOAD_URL, {
          headers: { encryptedHeaders: encryptedData },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = changeFilename;
        link.click();
        handleUpdateFileStatus(_id);
        successMessage("Download successful", 3000);
        setIsHide((prev) => ({
          ...prev,
          [index]: false,
        }));
        setIsSuccess((prev) => ({
          ...prev,
          [index]: true,
        }));
      } catch (error) {
        errorMessage("Something wrong try again!!", 2500);
      }
    } else {
      setTotalClickCount((prevCount) => prevCount + 1);
      if (totalClickCount >= getActionButton) {
        setLastClickedButton([...lastClickedButton, _id]);
        setTotalClickCount(0);
        e.preventDefault();
        const changeFilename = cutFileName(filename, newFilename);
        try {
          setIsHide((prev) => ({
            ...prev,
            [index]: true,
          }));
          const secretKey = ENV_KEYS.VITE_APP_UPLOAD_SECRET_KEY;
          const headers = {
            accept: "*/*",
            storageZoneName: BUNNY_STORAGE_ZONE,
            isFolder: false,
            path: "public/" + newFilename,
            fileName: CryptoJS.enc.Utf8.parse(newFilename),
            AccessKey: ACCESS_KEY,
          };

          const key = CryptoJS.enc.Utf8.parse(secretKey);
          const iv = CryptoJS.lib.WordArray.random(16);
          const encrypted = CryptoJS.AES.encrypt(JSON.stringify(headers), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });
          const cipherText = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
          const ivText = iv.toString(CryptoJS.enc.Base64);
          const encryptedData = cipherText + ":" + ivText;

          const response = await fetch(ENV_KEYS.VITE_APP_DOWNLOAD_URL, {
            headers: { encryptedHeaders: encryptedData },
          });

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = changeFilename;
          link.click();
          handleUpdateFileStatus(_id);
          successMessage("Download successful", 3000);
          setIsHide((prev) => ({
            ...prev,
            [index]: false,
          }));
          setIsSuccess((prev) => ({
            ...prev,
            [index]: true,
          }));
        } catch (error) {
          errorMessage("Something wrong try again!!", 2500);
        }
      } else {
        if (getAdvertisemment.length) {
          const availableAds: any[] = getAdvertisemment.filter(
            (ad) => !usedAds.includes(ad._id),
          );
          if (availableAds.length === 0) {
            setUsedAds([]);
            return;
          }
          const randomIndex = Math.floor(Math.random() * availableAds.length);
          const randomAd: any = availableAds[randomIndex];
          setUsedAds([...usedAds, randomAd._id]);
          try {
            const responseIp = await axios.get(LOAD_GET_IP_URL);
            const _createDetailAdvertisement = await createDetailAdvertisement({
              variables: {
                data: {
                  ip: String(responseIp?.data),
                  advertisementsID: randomAd?._id,
                },
              },
            });
            if (
              _createDetailAdvertisement?.data?.createDetailadvertisements?._id
            ) {
              window.open(randomAd.url, "_blank");
            }
          } catch (error) {
            errorMessage("Something wrong try again later!", 2000);
          }
        } else {
          e.preventDefault();
          const changeFilename = cutFileName(filename, newFilename);
          try {
            setIsHide((prev) => ({
              ...prev,
              [index]: true,
            }));
            const secretKey = ENV_KEYS.VITE_APP_UPLOAD_SECRET_KEY;
            const headers = {
              accept: "*/*",
              storageZoneName: BUNNY_STORAGE_ZONE,
              isFolder: false,
              path: "public/" + newFilename,
              fileName: CryptoJS.enc.Utf8.parse(newFilename),
              AccessKey: ACCESS_KEY,
            };

            const key = CryptoJS.enc.Utf8.parse(secretKey);
            const iv = CryptoJS.lib.WordArray.random(16);
            const encrypted = CryptoJS.AES.encrypt(
              JSON.stringify(headers),
              key,
              {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
              },
            );
            const cipherText = encrypted.ciphertext.toString(
              CryptoJS.enc.Base64,
            );
            const ivText = iv.toString(CryptoJS.enc.Base64);
            const encryptedData = cipherText + ":" + ivText;

            const response = await fetch(ENV_KEYS.VITE_APP_DOWNLOAD_URL, {
              headers: { encryptedHeaders: encryptedData },
            });

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = changeFilename;
            link.click();
            handleUpdateFileStatus(_id);
            successMessage("Download successful", 3000);
            setIsHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsSuccess((prev) => ({
              ...prev,
              [index]: true,
            }));
          } catch (error) {
            errorMessage("Something wrong try again!!", 2500);
          }
        }
      }
    }
  };

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
    if (item?.status == "expired") {
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
  }, [dropData, currentUrl]);

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

  return (
    <React.Fragment>
      {status == "expired" ? (
        <ExpiredArea>
          <Box
            sx={{
              textAlign: "center",
              fontSize: "1.2rem",
              fontWeight: 700,
              [theme.breakpoints.down("sm")]: {
                fontSize: "1rem",
              },
            }}
          >
            Unfortunately, the link you requested has expired.
          </Box>
          <Box
            sx={{
              textAlign: "center",
              fontSize: "0.9rem",
              margin: "0.5rem 0",
              fontWeight: 500,
            }}
          >
            You do not have permission to view this page using the credentials
            that you have provided while login.
          </Box>
          <Box
            sx={{ textAlign: "center", fontSize: "0.9rem", fontWeight: 500 }}
          >
            Please contact your site administrator.
          </Box>
          <Button
            variant="contained"
            component={NavLink}
            to="/filedrops"
            sx={{ mt: 4 }}
          >
            Create new
          </Button>
          <br />
        </ExpiredArea>
      ) : (
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
            <Typography component="p">
              {dataFromUrl?.expiredAt
                ? "This link will be expired on:" + dataFromUrl?.expiredAt
                  ? moment(dataFromUrl?.expiredAt).format("DD-MM-YYYY h:mm:ss")
                  : ""
                : ""}
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
      )}
    </React.Fragment>
  );
}

export default FileDropDownloader;

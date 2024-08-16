import { useLazyQuery, useMutation } from "@apollo/client";
import { styled } from "@mui/material/styles";
import CryptoJS from "crypto-js";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

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
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
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
import useManageGraphqlError from "hooks/useManageGraphqlError";
import moment from "moment";
import QRCode from "react-qr-code";
import { errorMessage, successMessage } from "utils/alert.util";
import { cutFileName } from "utils/file.util";
import { convertBytetoMBandGB } from "utils/storage.util";

const FiledropContainer = styled(Container)({
  // marginTop: "5rem",
  textAlign: "center",
  // padding: "4rem 0",
});


const UploadArea = styled(Box)(({ theme }) => ({
  padding: "2rem",
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


////display files zone
const FileListContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  flex: 1,
  gap: 6,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

//https://icon-sets.iconify.design/mdi/dots-horizontal/
const arrayMedias = [
  {
    id: 1,
    title: "Facebook",
    link: "",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Facebook",
    link: "",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17c.16.13.26.35.27.57l.05 1.78c.04.57.61.94 1.13.71l1.98-.87c.17-.06.36-.09.53-.06c.9.27 1.9.4 2.9.4c5.64 0 10-4.13 10-9.7S17.64 2 12 2m6 7.46l-2.93 4.67c-.47.73-1.47.92-2.17.37l-2.34-1.73a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.33-.97-.17-.68-.63l2.93-4.67c.47-.73 1.47-.92 2.17-.4l2.34 1.76a.6.6 0 0 0 .72 0l3.16-2.4c.42-.33.97.17.68.63"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "WhatsApp",
    link: "",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01"
        />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Telegram",
    link: "",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0.8em"
        height="0.8em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m4 6.03l7.5 3.22l-7.5-1zm7.5 8.72L4 17.97v-2.22zM2 3v7l15 2l-15 2v7l21-9z"
        />
      </svg>
    ),
  },
  {
    id: 99,
    title: "...",
    link: "",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 8.5a1.5 1.5 0 0 0-1.5 1.5a1.5 1.5 0 0 0 1.5 1.5a1.5 1.5 0 0 0 1.5-1.5a1.5 1.5 0 0 0-1.5-1.5m-5.5 0A1.5 1.5 0 0 0 5 12a1.5 1.5 0 0 0 1.5 1.5A1.5 1.5 0 0 0 8 12a1.5 1.5 0 0 0-1.5-1.5m11 0A1.5 1.5 0 0 0 16 12a1.5 1.5 0 0 0 1.5 1.5A1.5 1.5 0 0 0 19 12a1.5 1.5 0 0 0-1.5-1.5"
        />
      </svg>
    ),
  },
];

function FileDropDownloader() {
  const theme = createTheme();
  const manageGraphqlError = useManageGraphqlError();
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
  const [timeLeft, setTimeLeft] = useState("");
  // const [multiId, setMultiId] = useState<any>([]);
  // const [selectedRow, setSelectedRow] = React.useState([]);
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
    {
      fetchPolicy: "cache-and-network",
    },
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
    if (!currentUrl) {
      return;
    }

    getUserByDropUrl({
      variables: {
        where: {
          url: currentUrl,
        },
      },
      onError: (err)=>{
        setStatus('expired');
        const cutErr = err?.message?.replace(/(ApolloError: )?Error: /, "");
        errorMessage(
          manageGraphqlError.handleErrorMessage(
            cutErr ||
            err?.message ||
              "Something went wrong, Please try again",
          ) as string,
          2000,
        );
      },
      onCompleted: (data)=>{
        const item = data?.getPublicFileDropUrl?.data[0];

        // if (item?.status == "expired" || !item) {
        //   setStatus(item?.status || 'expired');
        // }
  
        setStatus(item?.status || 'expired');

        if (item?.createdBy?._id > 0 || item?.createdBy?._id) {
          setDataFromUrl(item);
          setUserId(item?.createdBy?._id);
          setNewName(item?.createdBy?.newName);
          setFolderId(item?.folderId?._id);
          setPath(item?.folderId?.path);
          setNewPath(item?.folderId?.newPath);
          setFolderNewName(item?.folderId?.newFolder_name);
        }
      }
    });
  }, [currentUrl, dropData]);

  
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
      const datas = filesData?.getFileDrop?.data?.map((value, index) => ({
        ...value,
        no: index + 1,
      }));

      setQueryFile(datas || []);
    }
  }, [filesData, currentUrl]);

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
        setTimeLeft("This link has expired");
        return;
      }

      const formattedDate = expirationTime.format("DD/MM/YYYY");
      const formattedTime = `${Math.floor(
        duration.asHours(),
      )}h ${duration.minutes()}m ${duration.seconds()}s`;
      setTimeLeft(`${formattedDate} ${formattedTime}`);
    };

    const intervalId = setInterval(updateCountdown, 1000);

    if (dataFromUrl.expiredAt) {
      updateCountdown();
    }

    return () => clearInterval(intervalId);
  }, [dataFromUrl?.expiredAt]);

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
                  status?.toLowerCase() === "active" ? "#FFEFE1" : "#dcf6e8",
                color:
                  status?.toLowerCase() === "active" ? "#FFA44F" : "#29c770",
              }}
              label={
                status?.toLowerCase() === "active" ? "/" + "Active" : "Inactive"
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
        const status = params?.row?.status || "Inactive";
        return (
          status?.toLowerCase() === "active" && (
            userId > 0 ? (
              <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
            ):
            (
            <>
              <Box>
                {isSuccess[params?.row?.no] ? (
                  <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
                ) : isHide[params?.row?.no] ? (
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
                          params?.row?.no,
                          params?.row?._id,
                          params?.row?.filename,
                          params?.row?.newFilename,
                        )
                      }
                    >
                      <DownloadIcon sx={{ ":hover": { color: "#17766B" } }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              <Box
              sx={{
                "&:hover": {
                  transform: "scale(1.05)",
                  cursor: "pointer",
                },
              }}
            >
              <QRCode
                style={{
                  backgroundColor: "#fff",
                  padding: "7px",
                  borderRadius: "7px",
                }}
                value={params?.row?.dropUrl}
                size={50}
                level="H"
                fgColor="#000000"
                bgColor="#FFFFFF"
              />
            </Box>
            </>
            )
          )
        );
      },
    },
  ];

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
            <Typography variant="h3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 300 150"
                width="300"
                height="100"
              >
                <text
                  x="80"
                  y="110"
                  fill="#17766b"
                  fontSize="50px"
                  fontFamily="Arial"
                  fontWeight="bold"
                >
                  OMG!
                </text>
              </svg>
            </Typography>
            Unfortunately, the link was expired.
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
            sx={{ mt: 7 }}
          >
            Get new link
          </Button>
          <br />
        </ExpiredArea>
      ) : (
        <Box sx={{ backgroundColor: "#ECF4F3", padding: "3rem 1rem" }}>
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
                    padding: "0.3rem",
                    borderRadius: "6px",
                    background: "#DFE6E7",
                  }}
                >
                  <FileUploadOutlinedIcon
                    sx={{ fontSize: "30px", color: "#5D596C" }}
                  />
                </Box>

                <Box className="box-drag" sx={{ m: 2 }}>
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
              <Typography component="p" sx={{ color: "#e31f09 !important" }}>
                {dataFromUrl?.expiredAt ? (
                  <>
                    <span style={{ color: "#000" }}>
                      This link will expire in:{" "}
                    </span>
                    <span
                      style={{
                        color: "#e31f09",
                        fontWeight: "700",
                        marginLeft: "1rem",
                      }}
                    >
                      {timeLeft.replace(/h|m|s/g, (match) => `${match}`)}
                    </span>
                  </>
                ) : (
                  ""
                )}
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
            {dataFromUrl?.folderId?._id
              ? ""
              : queryFile.length > 0 && (
                  <FileListContainer>
                    <Box
                      sx={{
                        width: { xs: "100%", md: "100%" },
                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                        overflow: "hidden",
                      }}
                    >
                      
                      <Card>
                        <Typography variant="h4" sx={{textAlign:'start', padding:'1rem .5rem'}}>
                          {dataFromUrl?.title ? dataFromUrl?.title : "File List"}
                        </Typography>
                        <CardContent
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            paddingLeft: "0 !important",
                            paddingRight: "0 !important",
                          }}
                        >
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
                            rows={queryFile}
                            columns={columns}
                            // checkboxSelection
                            disableSelectionOnClick
                            disableColumnFilter
                            disableColumnMenu
                            hideFooter
                            // onSelectionModelChange={(ids: any) => {
                            //   setSelectedRow(ids);
                            //   setMultiId(ids);
                            // }}
                          />
                          {queryFile?.length > 15 && (
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
                              >
                                {/* <PaginationStyled
                            currentPage={filter.data.currentPageNumber}
                            total={Math.ceil(
                              manageFileDrop.total / manageFileDrop.pageLimit,
                            )}
                            setCurrentPage={(e) =>
                              filter.dispatch({
                                type: filter.ACTION_TYPE.PAGINATION,
                                payload: e,
                              })
                            }
                          /> */}
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Box>
                    <Box
                      sx={{
                        width: { xs: "100%", md: "35%" },
                        borderRadius: 1.5,
                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={{ padding: "1.5rem" }}>
                        <Button
                          variant="contained"
                          sx={{ width: { xs: "100%", md: "80%" } }}
                        >
                          Download
                        </Button>
                        <Box sx={{ textAlign: "start", padding: "1rem 0" }}>
                          <Typography
                            variant="h5"
                            sx={{ color: "rgb(0,0,0,0.9)" }}
                          >
                            Social Share
                          </Typography>
                          <Typography
                            lineHeight={1}
                            sx={{
                              mt: 2,
                              fontWeight: 500,
                              color: "rgb(0,0,0,0.7)",
                            }}
                          >
                            Share this link via
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 3,
                            mt: 7,
                          }}
                        >
                          {arrayMedias.map((item, index) => (
                            <Button
                              key={index}
                              sx={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "100%",
                                background: "rgb(221, 221, 221,0.8)",
                                fontSize: "2rem",
                              }}
                            >
                              {item.icon}
                            </Button>
                          ))}
                        </Box>
                      </Box>
                      <Box
                        className="appbar appbar-bg-gradient-r"
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          justifyContent: "space-between",
                          width: "100%",
                          paddingTop: "1.2rem",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            color: "#fff",
                            padding: ".8rem",
                            textAlign: { xs: "center", md: "start" },
                            ml: ".4rem",
                          }}
                        >
                          <Typography variant={"h4"} sx={{ m: 0, p: 0 }}>
                            View on mobile phone
                          </Typography>
                          <Typography
                            variant={"h6"}
                            sx={{ my: 4, fontWeight: 400 }}
                          >
                            Scan to view on your mobile
                            <br />
                            phone for faster download
                          </Typography>
                          <Typography variant={"h6"} sx={{ fontWeight: 400 }}>
                            Android users cn scan with
                            <br />a browser, and iOS users can
                            <br /> scan with camera
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: ".9rem",
                          }}
                        >
                          <QRCode
                            style={{
                              backgroundColor: "#fff",
                              border: "1px solid gray",
                              padding: "7px",
                              borderRadius: "7px",
                            }}
                            value={"1234567"}
                            size={150}
                            level="H"
                            fgColor="#000000"
                            bgColor="#FFFFFF"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </FileListContainer>
                )}
          </FiledropContainer>
        </Box>
      )}
    </React.Fragment>
  );
}

export default FileDropDownloader;

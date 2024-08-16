import { useLazyQuery, useMutation } from "@apollo/client";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// components
import * as MUI from "./styles/fileUploader.style";
import "./styles/fileUploader.style.css";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  // IconButton,
  TextField,
  // Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  CREATE_DETAIL_ADVERTISEMENT,
  QUERY_ADVERTISEMENT,
  QUERY_MANAGE_LINK_DETAIL,
} from "api/graphql/ad.graphql";
import {
  QUERY_FILE_PUBLIC,
  QUERY_FILE_PUBLIC_LINK,
  QUERY_FILE_PUBLICV2,
} from "api/graphql/file.graphql";
import {
  QUERY_FOLDER_PUBLIC_LINK,
  QUERY_FOLDER_PUBLICV1,
} from "api/graphql/folder.graphql";
import { QUERY_SETTING } from "api/graphql/setting.graphql";
import { QUERY_USER } from "api/graphql/user.graphql";
import DialogPreviewQRcode from "components/dialog/DialogPreviewQRCode";
import CardFileDownloader from "components/presentation/CardFileDownloader";
import DeepLink from "components/presentation/DeepLink";
import DialogConfirmQRCode from "components/presentation/DialogConfirmQRCode";
import FolderDownloader from "components/presentation/FolderDownloader";
import FolderMultipleDownload from "components/presentation/FolderMultipleDownloader";
import { ENV_KEYS } from "constants/env.constant";
import CryptoJS from "crypto-js";
import useManageSetting from "hooks/useManageSetting";
import { errorMessage, successMessage } from "utils/alert.util";
import Helmet from "react-helmet";
import { combineOldAndNewFileNames, cutFileName } from "utils/file.util";
import { convertBytetoMBandGB } from "utils/storage.util";
import { decryptDataLink } from "utils/secure.util";
import useManageFiles from "hooks/useManageFile";
import { styled } from "@mui/system";
import QRCode from "react-qr-code";
import { DataGrid } from "@mui/x-data-grid";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";

////Ads
const AdsContainer = styled(Box)(({ theme }) => ({
  background: "#fff",
  display: "flex",
  flex: 1,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: "50%",
  margin: "0 auto",
  padding: ".5rem",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    padding: "0",
  },
}));

const AdsContent = styled(Box)(({ theme }) => ({
  padding: "1rem",
  background: "#ECF4F3",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: "8px",
  },
}));

const AdsCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 5px",
  margin: "0 auto",
  width: "80%",
  padding: ".5rem 1rem",
  background: "#fafafa",
  borderRadius: ".3rem",
  h4: { margin: "0.5rem 0", color: "#4B465C" },
  p: {
    color: "#6F6B7D",
    fontSize: "0.8rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    opacity: 0.9,
  },
  button: {
    padding: ".2rem 2rem",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
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
  gap: 10,
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


function FileUploader() {
  const location = useLocation();
  const [checkConfirmPassword, setConfirmPassword] = useState(false);
  const [getDataRes, setGetDataRes] = useState<any>(null);
  const [folderDownload, setFolderDownload] = useState<any>(null);
  const [folderSize, setFolderSize] = useState(0);
  const [folderType, setFolderType] = useState("");
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [filePasswords, setFilePasswords] = useState<any>("");
  const [getNewFileName, setGetNewFileName] = useState("");
  const [fileQRCodePassword, setFileQRCodePassword] = useState("");
  const [checkModal, setCheckModal] = useState(false);
  const [getFilenames, setGetFilenames] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isVerifyQrCode, setIsVerifyQRCode] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [getActionButton, setGetActionButton] = useState<any>();
  const [getAdvertisemment, setGetAvertisement] = useState<any>([]);
  const [usedAds, setUsedAds] = useState<any[]>([]);
  const [lastClickedButton, setLastClickedButton] = useState<any>([]);
  const [totalClickCount, setTotalClickCount] = useState(0);
  const [isHide, setIsHide] = useState<any>(false);
  const [isSuccess, setIsSuccess] = useState<any>(false);
  const [isProcessAll, setIsProcessAll] = useState(false);
  const [isDownloadAll, setIsDownloadAll] = useState(false);

  const [isMultipleHide, setIsMultipleHide] = useState<any>(false);
  const [isMultipleSuccess, setIsMultipleSuccess] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataValue, setDataValue] = useState<any>(null);
  const [platform, setPlatform] = useState("");
  const [showBottomDeep, setShowBottomDeep] = useState(false);
  const [_description, setDescription] = useState("No description");

  const [multipleType, setMultipleType] = useState("");
  const [fileDataSelect, setFileDataSelect] = useState<any>(null);
  const [folderDataSelect, setFolderDataSelect] = useState<any>(null);

  const [totalMultipleFolder, setTotalMultipleFolder] = useState(0);
  const [totalMultipleFile, setTotalMultipleFile] = useState(0);
  const [dataMultipleFile, setDataMultipleFile] = useState<any[]>([]);
  const [dataMultipleFolder, setDataMultipleFolder] = useState<any[]>([]);

  const params = new URLSearchParams(location.search);
  const linkValue = params.get("l");
  const urlClient = params.get("lc");
  const userqrcode = params.get("qr");
  const currentURL = window.location.href;

  const LOAD_GET_IP_URL = ENV_KEYS.VITE_APP_LOAD_GETIP_URL;

  // Deep linking for mobile devices
  const androidScheme = "vshare.app://download?url=" + currentURL;
  const iosScheme = "vshare.app://download?url=" + currentURL;

  // const [qrcodeUser, setQrcodeUser] = useState([]);
  const [index, setIndex] = useState<any>(null);
  const [hideDownload, seHideDownload] = useState(true);
  const [getData, { data: resPonData }] = useLazyQuery(QUERY_FILE_PUBLIC, {
    fetchPolicy: "cache-and-network",
  });

  // hooks
  const manageFile = useManageFiles();

  const [getFileLink, { data: dataFileLink }] = useLazyQuery(
    QUERY_FILE_PUBLIC_LINK,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const [getMultipleFile] = useLazyQuery(QUERY_FILE_PUBLICV2, {
    fetchPolicy: "cache-and-network",
  });

  const [getMultipleFolder] = useLazyQuery(QUERY_FOLDER_PUBLICV1, {
    fetchPolicy: "cache-and-network",
  });

  const [getManageLinkDetail, { data: dataFileAndFolderLink }] = useLazyQuery(
    QUERY_MANAGE_LINK_DETAIL,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const [getFolderLink, { data: dataFolderLink }] = useLazyQuery(
    QUERY_FOLDER_PUBLIC_LINK,
  );

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
  const settingKeys = {
    downloadKey: "HDLABTO",
  };
  const useDataSetting = useManageSetting();
  const [getUser] = useLazyQuery(QUERY_USER, {
    fetchPolicy: "no-cache",
  });

  let linkClient: any = { _id: "", type: "" };

  // let userData: any = { userId: "", newName: "" };

  try {
    if (urlClient) {
      const decode = handleDecryptFile(urlClient);
      // userData = {
      //   userId: decode?.userId,
      //   newName: decode?.newName,
      // };
      linkClient = {
        _id: decode?._id,
        type: decode?.type,
      };
    }
  } catch (error) {
    console.error(error);
  }

  console.log({linkClient});

  function handleDecryptFile(val) {
    const decryptedData = decryptDataLink(val);
    return decryptedData;
  }

  // get Download button
  useEffect(() => {
    function getDataSetting() {
      // Show download button
      const downloadData = useDataSetting.data?.find(
        (data) => data?.productKey === settingKeys.downloadKey,
      );
      if (downloadData) {
        if (downloadData?.status === "on") seHideDownload(false);
      }
    }

    getDataSetting();
  }, [useDataSetting.data]);

  // get User
  useEffect(() => {
    getUser({
      variables: {
        where: {
          newName: userqrcode,
        },
      },
      // onCompleted: (data) => {
      //   setQrcodeUser(data?.getUser?.data);
      // },
    });
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
      const countAction =
        getDataButtonDL?.general_settings?.data[0]?.action || 0;

      setGetActionButton(parseInt(`${countAction}`));
    }

    if (getDataAdvertisement?.getAdvertisement?.data[0]) {
      setGetAvertisement(getDataAdvertisement?.getAdvertisement?.data);
    }
  }, [getDataButtonDL, getDataAdvertisement]);

  useEffect(() => {
    const getLinkData = async () => {
      try {
        if (linkClient?._id) {
          if (linkClient?.type === "file") {
            setIsLoading(true);

            await getFileLink({
              variables: {
                where: {
                  _id: linkClient?._id,
                },
              },
            });

            setTimeout(() => {
              setIsLoading(false);
            }, 500);

            if (dataFileLink?.queryFileGetLinks?.data) {
              document.title =
                dataFileLink?.queryFileGetLinks?.data?.[0]?.filename ??
                "Vshare download file";

              if (dataFileLink?.queryFileGetLinks?.data?.[0]) {
                setDescription(
                  dataFileLink?.queryFileGetLinks?.data?.[0]?.filename +
                    " Vshare.net",
                );
              }
              setGetDataRes(dataFileLink?.queryFileGetLinks?.data || []);
            }
          }

          if (linkClient?.type === "folder") {
            setIsLoading(true);
            await getFolderLink({
              variables: {
                where: {
                  _id: linkClient?._id,
                },
              },
            });
            setTimeout(() => {
              setIsLoading(false);
            }, 500);

            const folderData = dataFolderLink?.queryfoldersGetLinks?.data || [];

            if (folderData?.[0]?.status === "active") {
              setGetDataRes(folderData || []);
              setFolderDownload(folderData || []);

              if (folderData && folderData?.[0]?.folder_type) {
                document.title =
                  folderData?.[0]?.folder_name || "Vshare download folder";
                if (folderData[0]?.folder_name) {
                  setDescription(folderData[0]?.folder_name + " Vshare.net");
                }
                setFolderType(folderData[0]?.folder_type);
                setFolderSize(folderData[0]?.total_size);
              }
            }
          }
        } else {
          setIsLoading(true);
          getData({
            variables: {
              where: {
                urlAll: linkValue ? String(linkValue) : null,
              },
            },
          });

          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          if (resPonData) {
            const fileData = resPonData?.filesPublic?.data?.[0];
            const title = cutFileName(
              combineOldAndNewFileNames(
                fileData?.filename,
                fileData?.newFilename,
              ) as string,
              10,
            );
            setDescription(`${title} Vshare.net`);
            document.title = title;
            setGetDataRes(resPonData?.filesPublic?.data);
          }
        }
      } catch (error: any) {
        setIsLoading(false);
        errorMessage(error);
      }
    };

    getLinkData();

    // return () => {
    //   document.title = "Download folder and file"; // Reset the title when the component unmounts
    // };
  }, [linkValue, urlClient, dataFileLink, dataFolderLink, resPonData]);

  console.log(dataFileLink);

  useEffect(() => {
    const getMultipleFileAndFolder = async () => {
      const os = navigator.userAgent;

      try {
        if (linkClient?._id)
          if (linkClient?.type === "multiple") {
            setIsLoading(true);

            await getManageLinkDetail({
              variables: {
                where: { _id: linkClient?._id },
              },
            });

            const mainData =
              dataFileAndFolderLink?.getManageLinkDetails?.data || [];

            if (mainData?.length > 0) {
              if (os.match(/iPhone|iPad|iPod/i)) {
                setPlatform("ios");
                setTimeout(() => {
                  setShowBottomDeep(true);
                }, 1000);
              } else if (os.match(/Android/i)) {
                setPlatform("android");
                setTimeout(() => {
                  setShowBottomDeep(true);
                }, 1000);
              }
              const fileData = mainData?.filter((file) => file.type === "file");
              const folderData = mainData?.filter(
                (folder) => folder.type === "folder",
              );

              if (folderData?.length > 0) {
                const resultFolders = await Promise.all(
                  folderData.map(async (folder) => {
                    const resFolder = await getMultipleFolder({
                      variables: {
                        id: folder?.folderId,
                        // where: {
                        //   _id: folder?.folderId,
                        //   status: "active",
                        // },
                      },
                    });
                    const resData = resFolder.data?.folderPublic?.data || [];
                    if (resData?.length) {
                      return resData;
                    }
                    return [];
                  }),
                );

                const dataFoldersFlat = resultFolders.flat();

                const folderMapSize = dataFoldersFlat.map((file) =>
                  parseInt(file.total_size || 0),
                );
                const totalFolders = folderMapSize.reduce(
                  (prev, current) => prev + current,
                );
                setTotalMultipleFolder(totalFolders);
                setDataMultipleFolder(dataFoldersFlat);
              }

              if (fileData?.length > 0) {
                const resultFiles = await Promise.all(
                  await fileData.map(async (file) => {
                    const result = await getMultipleFile({
                      variables: {
                        id: [file?.fileId],
                        // where: {
                        //   _id: file?.fileId,
                        //   status: "active",
                        // },
                      },
                    });

                    const resData = result.data?.filePublic?.data || [];

                    if (resData?.length) {
                      return resData;
                    }
                    return [];
                  }),
                );

                const dataFilesFlat = resultFiles.flat();
                const filesMapSize = dataFilesFlat.map((file) =>
                  parseInt(file.size),
                );
                const totalFiles = filesMapSize.reduce(
                  (prev, current) => prev + current,
                );
                setTotalMultipleFile(totalFiles);
                setDataMultipleFile(dataFilesFlat);
              }
            }

            setIsLoading(false);
            document.title = "Multiple File and folder";
            setDescription("Multiple File and folder on vshare.net");
          }
      } catch (error) {
        document.title = "No documents found";
        setDescription("No documents found on vshare.net");
        setIsLoading(false);
      }
    };
    getMultipleFileAndFolder();
  }, [dataFileAndFolderLink]);

  useEffect(() => {
    function handleDetectPlatform() {
      const os = navigator.userAgent;
      try {
        if (
          dataFileLink?.queryFileGetLinks?.data?.length ||
          dataFolderLink?.queryfoldersGetLinks?.data?.length
        ) {
          if (os.match(/iPhone|iPad|iPod/i)) {
            setPlatform("ios");
            setTimeout(() => {
              setShowBottomDeep(true);
            }, 1000);
          } else if (os.match(/Android/i)) {
            setPlatform("android");
            ``;
            setTimeout(() => {
              setShowBottomDeep(true);
            }, 1000);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    handleDetectPlatform();
  }, [dataFileLink, dataFolderLink]);

  useEffect(() => {
    if (getDataRes) {
      if (getDataRes[0]?.passwordUrlAll && !checkConfirmPassword) {
        handleClickOpen();
      }
    }
  }, [getDataRes]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const totalSize = getDataRes?.reduce((accumulator, current) => {
    return accumulator + parseInt(current.size);
  }, 0);

  // download folder
  const handleDownloadFolder = async ({ createdBy }) => {
    setTotalClickCount((prevCount) => prevCount + 1);
    if (totalClickCount >= getActionButton) {
      setTotalClickCount(0);

      const folder_name = `${folderDownload[0]?.folder_name}.zip`;

      try {
        if (folderDownload[0]?.access_password) {
          handleClickOpen();
        } else {
          setIsHide((prev) => ({
            ...prev,
            [1]: true,
          }));

          const multipleData = [
            {
              id: folderDownload?.[0]?._id,
              name: folder_name,
              newFilename: folderDownload?.[0].newFolder_name,
              checkType: "folder",
              newPath: folderDownload?.[0].newPath || "",
              createdBy,
            },
          ];

          await manageFile.handleDownloadFolder(
            { multipleData },
            {
              onSuccess: () => {
                setIsHide((prev) => ({
                  ...prev,
                  [1]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [1]: true,
                }));
              },
              onFailed: (error) => {
                errorMessage(error, 3000);
                setIsHide((prev) => ({
                  ...prev,
                  [1]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [1]: false,
                }));
              },
            },
          );
        }
      } catch (error) {
        errorMessage("Something wrong try again later!", 2000);
      }
    } else {
      if (getAdvertisemment?.length) {
        const availableAds = getAdvertisemment.filter(
          (ad) => !usedAds.includes(ad._id),
        );
        if (availableAds?.length === 0) {
          setUsedAds([]);
          return;
        }
        const randomIndex = Math.floor(Math.random() * availableAds?.length);
        const randomAd = availableAds[randomIndex];
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
            let httpData = "";
            if (!randomAd.url.match(/^https?:\/\//i || /^http?:\/\//i)) {
              httpData = "http://" + randomAd.url;
            } else {
              httpData = randomAd.url;
            }

            const newWindow = window.open(httpData, "_blank");
            if (
              !newWindow ||
              newWindow.closed ||
              typeof newWindow.closed == "undefined"
            ) {
              window.location.href = httpData;
            }
          }
        } catch (error) {
          errorMessage("Something wrong try again later!", 2000);
        }
      } else {
        const folder_name = `${folderDownload[0]?.folder_name}.zip`;

        try {
          if (folderDownload[0]?.access_password) {
            handleClickOpen();
          } else {
            setIsHide((prev) => ({
              ...prev,
              [1]: true,
            }));

            const multipleData = [
              {
                id: folderDownload?.[0]?._id,
                name: folder_name,
                newFilename: folderDownload?.[0].newFolder_name,
                checkType: "folder",
                newPath: folderDownload?.[0].newPath || "",
                createdBy,
              },
            ];

            await manageFile.handleDownloadFolder(
              { multipleData },
              {
                onSuccess: () => {
                  successMessage("Successfully downloaded", 3000);
                  setIsHide((prev) => ({
                    ...prev,
                    [1]: false,
                  }));
                  setIsSuccess((prev) => ({
                    ...prev,
                    [1]: true,
                  }));
                },
                onFailed: (error) => {
                  errorMessage(error, 3000);
                  setIsHide((prev) => ({
                    ...prev,
                    [1]: false,
                  }));
                  setIsSuccess((prev) => ({
                    ...prev,
                    [1]: false,
                  }));
                },
              },
            );
          }
        } catch (error: any) {
          errorMessage(error, 2000);
        }
      }
    }
  };

  // download multiple folder
  const handleMultipleDownloadFolder = async ({ folder, index }) => {
    setFolderDataSelect(folder);
    setMultipleType("folder");

    setTotalClickCount((prevCount) => prevCount + 1);
    if (totalClickCount >= getActionButton) {
      setTotalClickCount(0);

      try {
        if (folder?.access_password) {
          handleClickOpen();
        } else {
          handleDoneFolderDownload({
            folder,
            index,
          });
        }
      } catch (error) {
        errorMessage("Something wrong try again later!", 2000);
      }
    } else {
      if (getAdvertisemment.length) {
        const availableAds = getAdvertisemment.filter(
          (ad) => !usedAds.includes(ad._id),
        );
        if (availableAds.length === 0) {
          setUsedAds([]);
          return;
        }
        const randomIndex = Math.floor(Math.random() * availableAds.length);
        const randomAd = availableAds[randomIndex];
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
            let httpData = "";
            if (!randomAd.url.match(/^https?:\/\//i || /^http?:\/\//i)) {
              httpData = "http://" + randomAd.url;
            } else {
              httpData = randomAd.url;
            }

            const newWindow = window.open(httpData, "_blank");
            if (
              !newWindow ||
              newWindow.closed ||
              typeof newWindow.closed == "undefined"
            ) {
              window.location.href = httpData;
            }
          }
        } catch (error) {
          errorMessage("Something wrong try again later!", 2000);
        }
      } else {
        try {
          if (folder?.access_password) {
            handleClickOpen();
          } else {
            handleDoneFolderDownload({
              folder,
              index,
            });
          }
        } catch (error: any) {
          errorMessage(error, 2000);
        }
      }
    }
  };

  // Done
  const handleDoneFolderDownload = async ({ folder, index }) => {
    try {
      setIsMultipleHide((prev) => ({
        ...prev,
        [index]: true,
      }));
      setIsMultipleSuccess((prev) => ({ ...prev, [index]: false }));

      const path = folder?.newPath || "";
      const folder_name = `${folder?.folder_name}.zip`;

      const multipleData = [
        {
          id: folder._id,
          name: folder_name,
          newFilename: folder?.newFolder_name,
          checkType: "folder",
          newPath: path,
          createdBy: folder?.createdBy,
        },
      ];

      await manageFile.handleDownloadFolder(
        { multipleData },
        {
          onFailed: (error) => {
            setIsMultipleHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsMultipleSuccess((prev) => ({ ...prev, [index]: false }));
            errorMessage(error, 3000);
          },
          onSuccess: () => {
            successMessage("Successfully downloaded", 3000);
            setIsMultipleHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsMultipleSuccess((prev) => ({ ...prev, [index]: true }));
          },
        },
      );
    } catch (error: any) {
      setIsMultipleHide((prev) => ({
        ...prev,
        [index]: false,
      }));
      setIsMultipleSuccess((prev) => ({ ...prev, [index]: false }));
      errorMessage(error, 3000);
    }
  };

  const _downloadFiles = async (
    index,
    fileId,
    newFilename,
    filename,
    filePassword,
    newPath,
    createdBy,
    dataFile,
  ) => {
    setTotalClickCount((prevCount) => prevCount + 1);
    setFileDataSelect({ ...dataFile, newPath, createdBy });
    setMultipleType("file");

    if (totalClickCount >= getActionButton) {
      setLastClickedButton([...lastClickedButton, fileId]);
      setTotalClickCount(0);
      const changeFilename = combineOldAndNewFileNames(filename, newFilename);

      try {
        setFilePasswords(filePassword);
        setGetNewFileName(newFilename);
        if (linkClient?._id) {
          if (filePassword) {
            handleClickOpen();
          } else {
            handleDoneDownloadFiles({
              index,
              filename,
              newFilename,
              createdBy,
              dataFile,
            });
          }
        } else {
          if (filePassword) {
            handleClickOpen();
          } else {
            handleDoneDownloadFilesOnPublic({
              index,
              changeFilename,
              newFilename: dataFile?.newFilename,
              dataFile,
            });
          }
        }
      } catch (error: any) {
        errorMessage(error, 2000);
      }
    } else {
      if (getAdvertisemment.length) {
        const availableAds = getAdvertisemment.filter(
          (ad) => !usedAds.includes(ad._id),
        );
        if (availableAds.length === 0) {
          setUsedAds([]);
          return;
        }

        const randomIndex = Math.floor(Math.random() * availableAds.length);
        const randomAd = availableAds[randomIndex];
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
            let httpData = "";
            if (!randomAd.url.match(/^https?:\/\//i || /^http?:\/\//i)) {
              httpData = "http://" + randomAd.url;
            } else {
              httpData = randomAd.url;
            }

            const newWindow = window.open(httpData, "_blank");
            if (
              !newWindow ||
              newWindow.closed ||
              typeof newWindow.closed == "undefined"
            ) {
              window.location.href = httpData;
            }
          }
        } catch (error: any) {
          errorMessage(error, 3000);
        }
      } else {
        const changeFilename = combineOldAndNewFileNames(filename, newFilename);

        try {
          setFilePasswords(filePassword);
          setGetNewFileName(newFilename);

          if (filePassword) {
            handleClickOpen();
          } else {
            if (linkClient?._id) {
              handleDoneDownloadFiles({
                index,
                filename,
                newFilename,
                createdBy,
                dataFile,
              });
            } else {
              handleDoneDownloadFilesOnPublic({
                index,
                changeFilename,
                newFilename,
                dataFile,
              });
            }
          }
        } catch (error) {
          errorMessage("Something wrong try again later!", 2000);
        }
      }
    }
  };

  const handleDoneDownloadFiles = async ({
    index,
    filename,
    newFilename,
    createdBy,
    dataFile,
  }) => {
    try {
      setIsHide((prev) => ({
        ...prev,
        [index]: true,
      }));
      setIsSuccess((prev) => ({
        ...prev,
        [index]: false,
      }));

      const multipleData = [
        {
          id: dataFile._id,
          name: filename,
          newFilename: newFilename,
          checkType: "file",
          newPath: dataFile.newPath || "",
          createdBy: createdBy,
        },
      ];

      await manageFile.handleDownloadFile(
        { multipleData },
        {
          onSuccess: () => {
            setIsHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsSuccess((prev) => ({
              ...prev,
              [index]: true,
            }));
          },
          onFailed: (error) => {
            errorMessage(error, 3000);
            setIsHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsSuccess((prev) => ({
              ...prev,
              [index]: false,
            }));
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDoneDownloadFilesOnPublic = async ({
    index,
    newFilename,
    changeFilename,
    dataFile,
  }) => {
    try {
      setIsHide((prev) => ({
        ...prev,
        [index]: true,
      }));
      setIsSuccess((prev) => ({
        ...prev,
        [index]: false,
      }));

      const multipleData = [
        {
          id: dataFile._id,
          name: changeFilename,
          newFilename: newFilename,
          checkType: "file",
          newPath: "",
        },
      ];

      console.log({ multipleData });

      await manageFile.handleDownloadPublicFile(
        { multipleData },
        {
          onSuccess: () => {
            setIsHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsSuccess((prev) => ({
              ...prev,
              [index]: true,
            }));
          },
          onFailed: (error) => {
            errorMessage(error, 3000);
            setIsHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsSuccess((prev) => ({
              ...prev,
              [index]: false,
            }));
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const _downloadFilesAll = async (getData: any[]) => {
    const noPasswordData = getData.filter((item) => !item.filePassword);
    if (noPasswordData.length <= 0) {
      errorMessage("Download failed!", 3000);
      return;
    }

    setIsProcessAll(true);
    setIsDownloadAll(false);

    try {
      if (linkClient?._id) {
        const multipleData = getData.map((file: any) => {
          return {
            id: file._id,
            newPath: file.newPath || "",
            newFilename: file.newFilename,
          };
        });

        await manageFile.handleDownloadPublicFile(
          { multipleData },
          {
            onSuccess: () => {
              successMessage("Download files successful", 3000);
              setIsProcessAll(false);
              setIsDownloadAll(true);
            },
            onFailed: (error) => {
              errorMessage(error, 3000);
              setIsProcessAll(false);
              setIsDownloadAll(false);
            },
          },
        );
      } else {
        const multipleData = getData.map((file: any) => {
          return {
            id: file._id,
            newPath: "",
            newFilename: file.newFilename,
          };
        });

        await manageFile.handleDownloadPublicFile(
          { multipleData },
          {
            onSuccess: () => {
              setIsProcessAll(false);
              setIsDownloadAll(true);
            },
            onFailed: (error) => {
              errorMessage(error, 3000);
              setIsProcessAll(false);
              setIsDownloadAll(false);
            },
          },
        );
      }
    } catch (error) {
      errorMessage("Something wrong try again later!", 2000);
    }

    successMessage("Download successful", 3000);
    setIsHide(false);
    setIsSuccess(true);
  };

  const _confirmPasword = async (password) => {
    if (!filePasswords) {
      const modifyPassword = CryptoJS.MD5(password).toString();
      const getPassword = getDataRes[0]?.passwordUrlAll;
      if (modifyPassword === getPassword) {
        setConfirmPassword(true);
        successMessage("Successful!!", 3000);
        handleClose();
      } else {
        errorMessage("Invalid password!!", 3000);
      }
    } else {
      const modifyPassword = CryptoJS.MD5(password).toString();
      const getPassword = filePasswords;

      if (modifyPassword === getPassword) {
        setConfirmPassword(true);
        setIsHide((prev) => ({
          ...prev,
          [index]: true,
        }));
        setIsSuccess((prev) => ({
          ...prev,
          [index]: false,
        }));

        handleClose();
        if (linkClient?._id) {
          if (linkClient?.type === "multiple") {
            if (multipleType === "folder") {
              setIsMultipleHide((prev) => ({
                ...prev,
                [index]: true,
              }));
              setIsMultipleSuccess((prev) => ({
                ...prev,
                [index]: false,
              }));

              const path = folderDataSelect?.[0]?.newPath
                ? folderDataSelect?.[0]?.newPath
                : "";
              const multipleData = [
                {
                  id: folderDataSelect?.[0]._id,
                  newPath: path,
                  newFilename: folderDataSelect?.[0].newFolder_name,
                  createdBy: folderDataSelect?.[0]?.createdBy,
                },
              ];

              await manageFile.handleDownloadFolder(
                { multipleData },
                {
                  onSuccess: () => {
                    setIsMultipleHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsMultipleSuccess((prev) => ({
                      ...prev,
                      [index]: true,
                    }));
                  },
                  onFailed: (error) => {
                    errorMessage(error);
                    setIsMultipleHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsMultipleSuccess((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                  },
                },
              );
            } else {
              const multipleData = [
                {
                  id: fileDataSelect._id,
                  newPath: fileDataSelect.newPath || "",
                  newFilename: fileDataSelect.newFilename,
                  createdBy: fileDataSelect.createdBy,
                },
              ];

              await manageFile.handleDownloadFile(
                { multipleData },
                {
                  onSuccess: () => {
                    setIsHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsSuccess((prev) => ({
                      ...prev,
                      [index]: true,
                    }));
                  },
                  onFailed: (error) => {
                    errorMessage(error);
                    setIsHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsSuccess((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                  },
                },
              );
            }
          } else {
            if (linkClient?.type === "folder") {
              setIsHide((prev) => ({
                ...prev,
                [index]: true,
              }));
              setIsSuccess((prev) => ({
                ...prev,
                [index]: false,
              }));

              const path = folderDownload[0]?.newPath
                ? folderDownload[0]?.newPath
                : "";
              const multipleData = [
                {
                  id: folderDownload?.[0]._id,
                  newPath: path,
                  newFilename: folderDownload?.[0].newFolder_name,
                  createdBy: folderDownload?.[0]?.createdBy,
                },
              ];

              await manageFile.handleDownloadFolder(
                { multipleData },
                {
                  onSuccess: () => {
                    setIsHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsSuccess((prev) => ({
                      ...prev,
                      [index]: true,
                    }));
                  },
                  onFailed: (error) => {
                    errorMessage(error);
                    setIsHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsSuccess((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                  },
                },
              );
            } else {
              const multipleData = [
                {
                  id: fileDataSelect._id,
                  newPath: fileDataSelect.newPath || "",
                  newFilename: fileDataSelect.newFilename,
                  createdBy: fileDataSelect.createdBy,
                },
              ];

              await manageFile.handleDownloadPublicFile(
                { multipleData },
                {
                  onSuccess: () => {
                    setIsHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsSuccess((prev) => ({
                      ...prev,
                      [index]: true,
                    }));
                  },
                  onFailed: (error) => {
                    errorMessage(error);
                    setIsHide((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    setIsSuccess((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                  },
                },
              );
            }
          }
        } else {
          const multipleData = [
            {
              id: fileDataSelect._id,
            },
          ];

          await manageFile.handleDownloadPublicFile(
            { multipleData },
            {
              onSuccess: () => {
                setIsHide((prev) => ({
                  ...prev,
                  [index]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [index]: true,
                }));
              },
              onFailed: (error) => {
                errorMessage(error);
                setIsHide((prev) => ({
                  ...prev,
                  [index]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [index]: false,
                }));
              },
            },
          );
        }
      } else {
        //
      }
    }
  };

  const hasFileWithoutPassword = linkClient?._id
    ? linkClient?.type === "file"
      ? dataFileLink?.queryFileGetLinks?.data?.some(
          (item) => !item.filePassword,
        )
      : dataFolderLink?.queryfoldersGetLinks?.data?.some(
          (item) => !item.filePassword,
        )
    : resPonData?.filesPublic?.data?.some((item) => !item.filePassword);

  const previewHandleClose = () => {
    setPreviewOpen(false);
  };

  function handleOpenVerifyQRCode() {
    setIsVerifyQRCode(true);
  }

  function handleSuccessQRCode() {
    setTimeout(() => {
      setPreviewOpen(true);
    }, 200);
  }

  function handleCloseVerifyQRCode() {
    setFileQRCodePassword("");
    setIsVerifyQRCode(false);
  }

  const handleQRGeneration = (e, file, url) => {
    e.preventDefault();
    setDataValue(file);
    setFileUrl(url);
    if (file?.filePassword) {
      setFileQRCodePassword(file.filePassword);
      handleOpenVerifyQRCode();
    } else {
      setPreviewOpen(true);
    }
  };

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
            dataFileLink?.queryFileGetLinks?.total > 0 ? (
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
                  // <Tooltip title="Download" placement="top">
                  //   <IconButton
                  //     onClick={_downloadFiles}
                  //   >
                  //     <DownloadIcon sx={{ ":hover": { color: "#17766B" } }} />
                  //   </IconButton>
                  // </Tooltip>
                  null
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


  const isMobile = useMediaQuery("(max-width: 600px)");
console.log({dataFileLink});
  return (
    <React.Fragment>
      <Helmet>
        <meta name="title" content={"seoTitle"} />
        <meta name="description" content={_description} />
      </Helmet>
      <MUI.ContainerHome maxWidth="xl">
        <Dialog open={open}>
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: isMobile ? "0.9rem" : "1.2rem",
              }}
            >
              Confirm password
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "20px 30px !important",
                maxWidth: "600px",
              }}
            >
              {checkModal ? (
                <Typography
                  sx={{
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    textAlign: "center",
                  }}
                >
                  Please enter your password for:
                  <br />
                  <span style={{ color: "#17766B" }}>
                    {cutFileName(
                      combineOldAndNewFileNames(
                        getFilenames,
                        getNewFileName,
                      ) as string,
                      10,
                    )}
                  </span>
                </Typography>
              ) : (
                <Typography variant="h6" sx={{ padding: "0", margin: "0" }}>
                  Please enter your link password
                </Typography>
              )}
            </Box>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            {checkModal ? (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleClose()}
                  sx={{ background: "#EA5455" }}
                  size="small"
                >
                  Cancel
                </Button>
              </>
            ) : null}
            <Button
              variant="contained"
              color="success"
              onClick={() => _confirmPasword(password)}
              sx={{ background: "#17766B" }}
              size="small"
            >
              Verify
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ backgroundColor: "#ECF4F3", padding: "3rem 1rem" }}>
          <AdsContainer>
            <AdsContent>
              <AdsCard>
                <Typography variant="h4" component={"h4"}>
                  Mltidiscriplinary, Monthly
                </Typography>
                <Typography component={"p"}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Error, molestias.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center !important",
                  }}
                >
                  <Typography component={"div"} sx={{ opacity: 0.7 }}>
                    TIJER Research Journal
                  </Typography>
                  <Button variant="contained">Open</Button>
                </Box>
              </AdsCard>
            </AdsContent>
          </AdsContainer>
          <MUI.DivdownloadFile>
            <MUI.DivDownloadBox>
              {isLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress size={30} />
                </Box>
              ) : (
                <Fragment>
                  <MUI.BoxDownloadHeader>
                    <Fragment>
                      {linkClient?._id ? (
                        <Fragment>
                          {linkClient?.type === "file" && (
                            <>
                              {dataFileLink?.queryFileGetLinks?.total > 0 && (
                                <Typography variant="h3">
                                  {dataFileLink?.queryFileGetLinks?.total}&nbsp;
                                  Files ({convertBytetoMBandGB(totalSize)})
                                </Typography>
                              )}
                            </>
                          )}
                        </Fragment>
                      ) : (
                        <Typography variant="h3">
                          {resPonData?.filesPublic?.total}&nbsp; Files (
                          {convertBytetoMBandGB(totalSize)})
                        </Typography>
                      )}
                    </Fragment>
                  </MUI.BoxDownloadHeader>
                  {folderType && (
                    <MUI.DivDownloadFileBox>
                      <FolderDownloader
                        folderDownload={folderDownload}
                        isSuccess={isSuccess}
                        isHide={isHide}
                        isMobile={isMobile}
                        setPassword={setPassword}
                        setFilePasswords={setFilePasswords}
                        handleDownloadFolder={handleDownloadFolder}
                        folderSize={folderSize}
                        setIndex={setIndex}
                      />
                    </MUI.DivDownloadFileBox>
                  )}
                  <Fragment>
                    {linkClient?._id ? (
                      <Fragment>
                        {linkClient?.type === "file" && (
                          <Fragment>
                            {dataFileLink?.queryFileGetLinks?.total > 0 ? (
                              <CardFileDownloader
                                dataFiles={
                                  dataFileLink?.queryFileGetLinks?.data || []
                                }
                                isMobile={isMobile}
                                hideDownload={hideDownload}
                                isPublic={false}
                                isSuccess={isSuccess}
                                isHide={isHide}
                                downloadFiles={_downloadFiles}
                                downloadFilesAll={_downloadFilesAll}
                                setIndex={setIndex}
                                setPassword={setPassword}
                                setGetFilenames={setGetFilenames}
                                setGetNewFileName={setGetNewFileName}
                                setCheckModal={setCheckModal}
                                handleQRGeneration={handleQRGeneration}
                                hasFileWithoutPassword={hasFileWithoutPassword}
                                fileTotal={
                                  dataFileLink?.queryFileGetLinks?.total || 0
                                }
                              />
                            ) : (
                              <Fragment>
                                {!folderType && (
                                  <MUI.DivDownloadFileBoxWrapper>
                                    <Typography variant="h1">
                                      No documents uploaded
                                    </Typography>
                                  </MUI.DivDownloadFileBoxWrapper>
                                )}
                              </Fragment>
                            )}
                          </Fragment>
                        )}

                        {/* File and Folder for multiple */}
                        {linkClient?.type === "multiple" && (
                          <Fragment>
                            {dataMultipleFile.length > 0 ||
                            dataMultipleFolder.length > 0 ? (
                              <Fragment>
                                {dataMultipleFolder.length > 0 && (
                                  <MUI.BoxMultipleFolder>
                                    <Fragment>
                                      <Typography variant="h4" sx={{ mb: 2 }}>
                                        {dataMultipleFolder.length} Folders (
                                        {convertBytetoMBandGB(
                                          totalMultipleFolder,
                                        )}
                                        )
                                      </Typography>

                                      {dataMultipleFolder.map(
                                        (folder, index) => {
                                          return (
                                            <MUI.DivDownloadFileBox
                                              sx={{ padding: "5px 0" }}
                                              key={index}
                                            >
                                              <FolderMultipleDownload
                                                index={index}
                                                folderName={
                                                  folder?.folder_name ||
                                                  "unknown"
                                                }
                                                folderPassword={
                                                  folder?.access_password
                                                }
                                                folderSize={parseInt(
                                                  folder?.total_size,
                                                )}
                                                isSuccess={isMultipleSuccess}
                                                isHide={isMultipleHide}
                                                isMobile={isMobile}
                                                setPassword={setPassword}
                                                setFilePasswords={
                                                  setFilePasswords
                                                }
                                                handleDownloadFolder={() =>
                                                  handleMultipleDownloadFolder({
                                                    folder,
                                                    index,
                                                  })
                                                }
                                              />
                                            </MUI.DivDownloadFileBox>
                                          );
                                        },
                                      )}
                                    </Fragment>
                                  </MUI.BoxMultipleFolder>
                                )}

                                {dataMultipleFile.length > 0 && (
                                  <Fragment>
                                    <Typography variant="h4" sx={{ mb: 2 }}>
                                      {dataMultipleFile.length} Files (
                                      {convertBytetoMBandGB(totalMultipleFile)})
                                    </Typography>

                                    <CardFileDownloader
                                      dataFiles={dataMultipleFile || []}
                                      isMobile={isMobile}
                                      hideDownload={hideDownload}
                                      isPublic={false}
                                      isSuccess={isSuccess}
                                      isHide={isHide}
                                      downloadFiles={_downloadFiles}
                                      downloadFilesAll={_downloadFilesAll}
                                      setIndex={setIndex}
                                      setPassword={setPassword}
                                      setGetFilenames={setGetFilenames}
                                      setGetNewFileName={setGetNewFileName}
                                      setCheckModal={setCheckModal}
                                      handleQRGeneration={handleQRGeneration}
                                      hasFileWithoutPassword={
                                        hasFileWithoutPassword
                                      }
                                      fileTotal={
                                        dataFileLink?.queryFileGetLinks
                                          ?.total || 0
                                      }
                                    />
                                  </Fragment>
                                )}
                              </Fragment>
                            ) : (
                              <MUI.DivDownloadFileBoxWrapper>
                                <Typography variant="h3">
                                  No documents uploaded
                                </Typography>
                              </MUI.DivDownloadFileBoxWrapper>
                            )}
                          </Fragment>
                        )}
                      </Fragment>
                    ) : (
                      <Fragment>
                        {/* -public Files Public */}
                        {!folderType && resPonData?.filesPublic?.total > 0 ? (
                          <CardFileDownloader
                            dataFiles={resPonData?.filesPublic?.data || []}
                            isMobile={isMobile}
                            hideDownload={hideDownload}
                            isDownloadAll={isDownloadAll}
                            isProcessing={isProcessAll}
                            isPublic={true}
                            isSuccess={isSuccess}
                            isHide={isHide}
                            downloadFiles={_downloadFiles}
                            downloadFilesAll={_downloadFilesAll}
                            setIndex={setIndex}
                            setPassword={setPassword}
                            setGetFilenames={setGetFilenames}
                            setGetNewFileName={setGetNewFileName}
                            setCheckModal={setCheckModal}
                            handleQRGeneration={handleQRGeneration}
                            hasFileWithoutPassword={hasFileWithoutPassword}
                            fileTotal={resPonData?.filesPublic?.total || 0}
                          />
                        ) : (
                          <Fragment>
                            {!folderType && !isLoading && (
                              <MUI.DivDownloadFileBoxWrapper>
                                <Typography variant="h1">
                                  No documents uploaded
                                </Typography>
                              </MUI.DivDownloadFileBoxWrapper>
                            )}
                          </Fragment>
                        )}
                      </Fragment>
                    )}
                  </Fragment>
                </Fragment>
              )}
            </MUI.DivDownloadBox>
          </MUI.DivdownloadFile>
          {/* table  */}
          {
            !isLoading && (dataFileLink?.queryFileGetLinks?.data?.length > 0 || dataMultipleFile.length > 0 ||
              dataMultipleFolder.length > 0) &&
            <FileListContainer>
            <Box
              sx={{
                width: { xs: "100%", md: "70%" },
                overflow: "hidden",
              }}
            >
                      
              <Card sx={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px"
              }}>
                <Typography variant="h4" sx={{textAlign:'start', padding:'1rem .5rem'}}>
                  {_description}
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
                    rows={
                      dataFileLink?.queryFileGetLinks?.data?.length >0 ?
                      dataFileLink?.queryFileGetLinks?.data
                      :
                      dataMultipleFile.length < 0 ?
                      dataMultipleFile
                      :
                      dataMultipleFolder.length > 0 ?
                      dataMultipleFolder : []
                    }
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
                  {dataFileLink?.queryFileGetLinks?.data?.length > 15 && (
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
              <Box sx={{ padding: "1.5rem"}}>
                <Box sx={{display:'flex'}}>
                  <Button
                    variant="contained"
                    sx={{ width: { xs: "100%", md: "80%" },mx:'auto !important' }}
                  >
                    Download
                  </Button>
                </Box>
                <Box sx={{ textAlign: "start", padding: "1rem 0",}}>
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
          }
        </Box>
      </MUI.ContainerHome>

      <DialogPreviewQRcode
        data={fileUrl}
        isOpen={previewOpen}
        onClose={previewHandleClose}
      />

      <DeepLink
        showBottom={showBottomDeep}
        platform={platform}
        scriptScheme={platform === "android" ? androidScheme : iosScheme}
        onClose={() => setShowBottomDeep(false)}
      />

      <DialogConfirmQRCode
        isOpen={isVerifyQrCode}
        f
        dataValue={dataValue}
        filename={dataValue?.filename}
        newFilename={dataValue?.newFilename}
        dataPassword={fileQRCodePassword}
        onConfirm={handleSuccessQRCode}
        onClose={handleCloseVerifyQRCode}
      />
    </React.Fragment>
  );
}

export default FileUploader;

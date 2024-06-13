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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
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
} from "api/graphql/file.graphql";
import {
  QUERY_FOLDER_PUBLIC,
  QUERY_FOLDER_PUBLIC_LINK,
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
import { base64Decode } from "utils/base64.util";
import {
  combineOldAndNewFileNames,
  cutFileName,
  removeFileNameOutOfPath,
} from "utils/file.util";
import { convertBytetoMBandGB } from "utils/storage.util";
import { encryptDownloadData } from "utils/secure.util";

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
  const [getFileName, setGetFileName] = useState<any>("");
  const [checkModal, setCheckModal] = useState(false);
  const [getFilenames, setGetFilenames] = useState("");
  const [getFolderName, setGetFolderName] = useState("");
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
  const [isMultipleHide, setIsMultipleHide] = useState<any>(false);
  const [isMultipleSuccess, setIsMultipleSuccess] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataValue, setDataValue] = useState<any>(null);
  const [platform, setPlatform] = useState("");
  const [showBottomDeep, setShowBottomDeep] = useState(false);
  const [_description, setDescription] = useState("No description");

  const [totalMultipleFolder, setTotalMultipleFolder] = useState(0);
  const [totalMultipleFile, setTotalMultipleFile] = useState(0);
  const [dataMultipleFile, setDataMultipleFile] = useState<any[]>([]);
  const [dataMultipleFolder, setDataMultipleFolder] = useState<any[]>([]);

  const params = new URLSearchParams(location.search);
  const linkValue = params.get("l");
  const urlClient = params.get("lc");
  const userqrcode = params.get("qr");
  const currentURL = window.location.href;

  const ACCESS_KEY = ENV_KEYS.VITE_APP_ACCESSKEY_BUNNY;
  const BUNNY_STORAGE_ZONE = ENV_KEYS.VITE_APP_STORAGE_ZONE;
  const LOAD_GET_IP_URL = ENV_KEYS.VITE_APP_LOAD_GETIP_URL;
  const ENCODE_KEY = ENV_KEYS.VITE_APP_ENCODE_KEY;

  // Deep linking for mobile devices
  const androidScheme = "vshare.app://download?url=" + currentURL;
  const iosScheme = "vshare.app://download?url=" + currentURL;

  // const [qrcodeUser, setQrcodeUser] = useState([]);
  const [index, setIndex] = useState<any>(null);
  const [hideDownload, seHideDownload] = useState(true);
  const [getData, { data: resPonData }] = useLazyQuery(QUERY_FILE_PUBLIC, {
    fetchPolicy: "cache-and-network",
  });

  const [getFileLink, { data: dataFileLink }] = useLazyQuery(
    QUERY_FILE_PUBLIC_LINK,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const [getMultipleFile] = useLazyQuery(QUERY_FILE_PUBLIC, {
    fetchPolicy: "cache-and-network",
  });

  const [getMultipleFolder] = useLazyQuery(QUERY_FOLDER_PUBLIC, {
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

  let linkClient: any = null;
  let linkClientData: any = "";

  let userData: any = { userId: "", newName: "" };

  try {
    if (urlClient) {
      linkClientData = urlClient?.split("-");
      userData = {
        userId: handleDecryptFile(linkClientData[1]),
        newName: linkClientData[2],
      };

      linkClient = handleDecryptFile(linkClientData[0]);
    }
  } catch (error) {
    console.error(error);
  }

  function handleDecryptFile(val) {
    const decryptedData = JSON.parse(base64Decode(val, ENCODE_KEY));
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
                  folderData[0]?.folder_name ?? "Vshare download folder";
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
            document.title = resPonData?.filesPublic?.data?.[0]?.filename;
            setGetDataRes(resPonData?.filesPublic?.data);
          }
        }
      } catch (error: any) {
        setIsLoading(false);
        errorMessage(error);
      }
    };

    getLinkData();

    return () => {
      document.title = "Download folder and file"; // Reset the title when the component unmounts
    };
  }, [urlClient, linkValue, resPonData, dataFileLink, dataFolderLink]);

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

            if (mainData.length > 0) {
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

              if (folderData.length > 0) {
                const resultFolders = await Promise.all(
                  folderData.map(async (folder) => {
                    const resFolder = await getMultipleFolder({
                      variables: {
                        where: {
                          _id: folder?.folderId,
                          status: "active",
                        },
                      },
                    });
                    const resData =
                      resFolder.data?.queryFolderPublic?.data || [];
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

              if (fileData.length > 0) {
                const resultFiles = await Promise.all(
                  await fileData.map(async (file) => {
                    const result = await getMultipleFile({
                      variables: {
                        where: {
                          _id: file?.fileId,
                          status: "active",
                        },
                      },
                    });

                    const resData = result.data?.filesPublic?.data || [];

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
  const handleDownloadFolder = async () => {
    setTotalClickCount((prevCount) => prevCount + 1);
    if (totalClickCount >= getActionButton) {
      setTotalClickCount(0);

      const path = folderDownload[0]?.newPath ?? "";
      const folder_name = `${folderDownload[0]?.folder_name}.zip`;

      setGetFolderName(folder_name);

      try {
        if (folderDownload[0]?.access_password) {
          handleClickOpen();
        } else {
          setIsHide(true);
          setIsSuccess(false);

          const headers = {
            _id: folderDownload[0]?._id,
            accept: "/",
            storageZoneName: BUNNY_STORAGE_ZONE,
            isFolder: true,
            path: userData.newName + "-" + userData.userId + "/" + path,
            fileName: CryptoJS.enc.Utf8.parse(folder_name),
            AccessKey: ACCESS_KEY,
          };

          const encryptedData = encryptDownloadData(headers);
          const response = await fetch(ENV_KEYS.VITE_APP_DOWNLOAD_URL, {
            headers: { encryptedHeaders: encryptedData },
          });

          const reader = response.body!.getReader();
          const stream = new ReadableStream({
            async start(controller) {
              // eslint-disable-next-line no-constant-condition
              while (true) {
                try {
                  const { done, value } = await reader.read();

                  if (done) {
                    successMessage("Download successful", 2000);
                    setIsHide(false);
                    setIsSuccess(true);
                    controller.close();
                    break;
                  }

                  controller.enqueue(value);
                } catch (error: any) {
                  setIsHide(false);
                  setIsSuccess(false);
                  errorMessage(error, 2000);
                  controller.error(error);
                  break;
                }
              }
            },
          });
          const blob = await new Response(stream).blob();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = folder_name;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(blobUrl);
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
        const path = folderDownload[0]?.newPath;
        const folder_name = `${folderDownload[0]?.folder_name}.zip`;
        setGetFolderName(folder_name);
        try {
          if (folderDownload[0]?.access_password) {
            handleClickOpen();
          } else {
            setIsHide(true);
            setIsSuccess(false);

            const headers = {
              accept: "/",
              storageZoneName: BUNNY_STORAGE_ZONE,
              isFolder: true,
              path: userData.newName + "-" + userData.userId + "/" + path,
              fileName: CryptoJS.enc.Utf8.parse(folder_name),
              AccessKey: ACCESS_KEY,
              _id: folderDownload[0]?._id,
            };

            const encryptedData = encryptDownloadData(headers);
            const response = await fetch(ENV_KEYS.VITE_APP_DOWNLOAD_URL, {
              headers: { encryptedHeaders: encryptedData },
            });

            const reader = response.body!.getReader();
            const stream = new ReadableStream({
              async start(controller) {
                // eslint-disable-next-line no-constant-condition
                while (true) {
                  try {
                    const { done, value } = await reader.read();

                    if (done) {
                      successMessage("Download successful", 2000);
                      setIsHide(false);
                      setIsSuccess(true);
                      controller.close();
                      break;
                    }

                    controller.enqueue(value);
                  } catch (error: any) {
                    setIsHide(false);
                    setIsSuccess(false);
                    errorMessage(error, 2000);
                    controller.error(error);
                    break;
                  }
                }
              },
            });
            const blob = await new Response(stream).blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = folder_name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
          }
        } catch (error: any) {
          errorMessage(error, 2000);
        }
      }
    }
  };

  // download multiple folder
  const handleMultipleDownloadFolder = async ({ folder, index }) => {
    setTotalClickCount((prevCount) => prevCount + 1);
    if (totalClickCount >= getActionButton) {
      setTotalClickCount(0);
      const folder_name = `${folder?.folder_name}.zip`;

      setGetFolderName(folder_name);

      try {
        if (folder?.access_password) {
          handleClickOpen();
        } else {
          handleDoneMultipleDownload({
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
        const folder_name = `${folder?.folder_name}.zip`;
        setGetFolderName(folder_name);

        try {
          if (folder?.access_password) {
            handleClickOpen();
          } else {
            handleDoneMultipleDownload({
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
  const handleDoneMultipleDownload = async ({ folder, index }) => {
    try {
      setIsMultipleHide((prev) => ({
        ...prev,
        [index]: true,
      }));
      setIsMultipleSuccess((prev) => ({ ...prev, [index]: false }));

      const path = folder?.newPath ?? "";
      const folder_name = `${folder?.folder_name}.zip`;

      const headers = {
        _id: folder?._id,
        accept: "/",
        storageZoneName: BUNNY_STORAGE_ZONE,
        isFolder: true,
        path: userData.newName + "-" + userData.userId + "/" + path,
        fileName: CryptoJS.enc.Utf8.parse(folder_name),
        AccessKey: ACCESS_KEY,
      };

      const encryptedData = encryptDownloadData(headers);
      const response = await fetch(ENV_KEYS.VITE_APP_DOWNLOAD_URL, {
        headers: { encryptedHeaders: encryptedData },
      });

      const reader = response.body!.getReader();
      const stream = new ReadableStream({
        async start(controller) {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            try {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                break;
              }

              controller.enqueue(value);
            } catch (error) {
              controller.error(error);
              break;
            }
          }
        },
      });

      const blob = await new Response(stream).blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = folder_name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      successMessage("Download successful", 2000);
      setIsMultipleHide((prev) => ({
        ...prev,
        [index]: false,
      }));
      setIsMultipleSuccess((prev) => ({ ...prev, [index]: true }));
    } catch (error: any) {
      setIsMultipleHide((prev) => ({
        ...prev,
        [index]: false,
      }));
      setIsMultipleSuccess((prev) => ({ ...prev, [index]: false }));
      errorMessage(error, 2000);
    }
  };

  const _downloadFiles = async (
    index,
    buttonId,
    newFilename,
    filename,
    filePassword,
  ) => {
    setTotalClickCount((prevCount) => prevCount + 1);

    if (totalClickCount >= getActionButton) {
      setLastClickedButton([...lastClickedButton, buttonId]);
      setTotalClickCount(0);
      const changeFilename = combineOldAndNewFileNames(filename, newFilename);
      let real_path;

      if (linkClient?.type === "multiple") {
        if (!dataMultipleFile[0].newPath) {
          real_path = "";
        } else {
          real_path = removeFileNameOutOfPath(dataMultipleFile[0].newPath);
        }
      } else {
        if (getDataRes[0].newPath === null) {
          real_path = "";
        } else {
          real_path = removeFileNameOutOfPath(getDataRes[0].newPath);
        }
      }

      try {
        setFilePasswords(filePassword);
        setGetNewFileName(newFilename);
        setGetFileName(changeFilename);
        if (linkClient?._id) {
          if (filePassword) {
            handleClickOpen();
          } else {
            handleDoneDownloadFiles({
              index,
              changeFilename,
              newFilename,
              real_path,
            });
          }
        } else {
          if (filePassword) {
            handleClickOpen();
          } else {
            handleDoneDownloadFilesOnPublic({
              index,
              changeFilename,
              newFilename,
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
          errorMessage(error, 2000);
        }
      } else {
        const changeFilename = combineOldAndNewFileNames(filename, newFilename);
        let real_path = "";
        if (linkClient?.type === "multiple") {
          if (!dataMultipleFile[0].newPath) {
            real_path = "";
          } else {
            real_path = removeFileNameOutOfPath(dataMultipleFile[0].newPath);
          }
        } else {
          if (getDataRes[0].newPath === null) {
            real_path = "";
          } else {
            real_path = removeFileNameOutOfPath(getDataRes[0].newPath);
          }
        }

        try {
          setFilePasswords(filePassword);
          setGetNewFileName(newFilename);
          setGetFileName(changeFilename);

          if (filePassword) {
            handleClickOpen();
          } else {
            if (linkClient?._id) {
              handleDoneDownloadFiles({
                index,
                changeFilename,
                newFilename,
                real_path,
              });
            } else {
              handleDoneDownloadFilesOnPublic({
                index,
                changeFilename,
                newFilename,
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
    real_path,
    newFilename,
    changeFilename,
  }) => {
    try {
      setIsHide((prev) => ({
        ...prev,
        [index]: true,
      }));

      const userPath =
        userData.userId === 0
          ? "public"
          : userData?.newName + "-" + userData?.userId;

      const headers = {
        accept: "*/*",
        storageZoneName: BUNNY_STORAGE_ZONE,
        isFolder: false,
        path: userPath + "/" + real_path + newFilename,
        fileName: CryptoJS.enc.Utf8.parse(newFilename),
        AccessKey: ACCESS_KEY,
      };

      const encryptedData = encryptDownloadData(headers);
      const response = await fetch(ENV_KEYS.VITE_APP_DOWNLOAD_URL, {
        headers: { encryptedHeaders: encryptedData },
      });
      const reader = response.body!.getReader();
      const stream = new ReadableStream({
        async start(controller) {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            try {
              const { done, value } = await reader.read();
              console.log(done, value);
              if (done) {
                successMessage("Download successful", 3000);
                setIsHide((prev) => ({
                  ...prev,
                  [index]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [index]: true,
                }));
                controller.close();
                break;
              }

              controller.enqueue(value);
            } catch (error: any) {
              errorMessage(error, 2000);
              controller.error(error);
              break;
            }
          }
        },
      });
      const blob = await new Response(stream).blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = changeFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDoneDownloadFilesOnPublic = async ({
    index,
    newFilename,
    changeFilename,
  }) => {
    try {
      setIsHide((prev) => ({
        ...prev,
        [index]: true,
      }));

      const headers = {
        accept: "*/*",
        storageZoneName: BUNNY_STORAGE_ZONE,
        isFolder: false,
        path: `public/${newFilename}`,
        fileName: CryptoJS.enc.Utf8.parse(newFilename),
        AccessKey: ACCESS_KEY,
      };

      const encryptedData = encryptDownloadData(headers);
      const response = await fetch(ENV_KEYS.VITE_APP_DOWNLOAD_URL, {
        headers: { encryptedHeaders: encryptedData },
      });
      const reader = response.body!.getReader();
      const stream = new ReadableStream({
        async start(controller) {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            try {
              const { done, value } = await reader.read();
              if (done) {
                successMessage("Download successful", 3000);
                setIsHide((prev) => ({
                  ...prev,
                  [index]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [index]: true,
                }));
                controller.close();
                break;
              }

              controller.enqueue(value);
            } catch (error: any) {
              errorMessage(error, 2000);
              controller.error(error);
              break;
            }
          }
        },
      });
      const blob = await new Response(stream).blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = changeFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const _downloadFilesAll = async (getData) => {
    // setIsDownloadAll(true);
    let newFilename: any = null;
    let filename: any = null;
    let filePassword = null;
    const noPasswordData = getData.filter((item) => !item.filePassword);
    if (noPasswordData.length <= 0) {
      errorMessage("Download failed!", 3000);
      return;
    }
    const downloadPromises: any[] = [];
    setIsHide(true);
    for (const file of noPasswordData) {
      newFilename = file?.newFilename;
      filename = file?.filename;
      filePassword = file?.filePassword;
      const changeFilename: string = combineOldAndNewFileNames(
        filename,
        newFilename,
      ) as string;
      let real_path;
      if (getDataRes[0].path === null) {
        real_path = "";
      } else {
        real_path = removeFileNameOutOfPath(getDataRes[0].path);
      }
      try {
        setFilePasswords(filePassword);
        setGetNewFileName(newFilename);
        setGetFileName(changeFilename);
        if (linkClient?._id) {
          // const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
          const headers = {
            accept: "*/*",
            storageZoneName: BUNNY_STORAGE_ZONE,
            isFolder: false,
            path: userData.username + "/" + real_path + newFilename,
            fileName: CryptoJS.enc.Utf8.parse(newFilename),
            AccessKey: ACCESS_KEY,
          };

          const encryptedData = encryptDownloadData(headers);
          const response = await fetch(ENV_KEYS.VITE_APP_DOWNLOAD_URL, {
            headers: { encryptedHeaders: encryptedData },
          });

          const downloads = new Promise((resolve, reject) => {
            (async () => {
              const reader = response.body!.getReader();
              const stream = new ReadableStream({
                async start(controller) {
                  // eslint-disable-next-line no-constant-condition
                  while (true) {
                    try {
                      const { done, value } = await reader.read();
                      if (done) {
                        resolve(true);
                        controller.close();
                        break;
                      }
                      controller.enqueue(value);
                    } catch (error: any) {
                      errorMessage("Something wrong try again later!", 2000);
                      reject(error);
                      controller.error(error);
                      break;
                    }
                  }
                },
              });
              const blob = await new Response(stream).blob();
              const blobUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = blobUrl;
              a.download = changeFilename;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(blobUrl);
            })();
          });

          downloadPromises.push(downloads);
        } else {
          if (filePassword) {
            handleClickOpen();
          } else {
            const headers = {
              accept: "*/*",
              storageZoneName: BUNNY_STORAGE_ZONE,
              isFolder: false,
              path: `public/${newFilename}`,
              fileName: CryptoJS.enc.Utf8.parse(newFilename),
              AccessKey: ACCESS_KEY,
            };

            const encryptedData = encryptDownloadData(headers);
            const response = await fetch(ENV_KEYS.VITE_APP_DOWNLOAD_URL, {
              headers: { encryptedHeaders: encryptedData },
            });
            const downloads = new Promise((resolve, reject) => {
              (async () => {
                const reader = response.body!.getReader();
                const stream = new ReadableStream({
                  async start(controller) {
                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                      try {
                        const { done, value } = await reader.read();
                        if (done) {
                          resolve(true);
                          controller.close();
                          break;
                        }
                        controller.enqueue(value);
                      } catch (error: any) {
                        errorMessage("Something wrong try again later!", 2000);
                        reject(error);
                        controller.error(error);
                        break;
                      }
                    }
                  },
                });
                const blob = await new Response(stream).blob();
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = changeFilename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(blobUrl);
              })();
            });
            downloadPromises.push(downloads);
          }
        }
      } catch (error) {
        errorMessage("Something wrong try again later!", 2000);
      }
    }
    await Promise.all(downloadPromises);
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
        handleClose();
        // const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
        let headers: any = null;
        if (linkClient?._id) {
          let real_path = "";
          if (getDataRes[0].newPath) {
            real_path = removeFileNameOutOfPath(getDataRes[0].newPath);
          }

          if (linkClient?.type === "folder") {
            const path = folderDownload[0]?.newPath ?? "";
            headers = {
              _id: folderDownload[0]?._id,
              accept: "/",
              storageZoneName: BUNNY_STORAGE_ZONE,
              isFolder: true,
              path: userData.newName + "-" + userData.userId + "/" + path,
              fileName: CryptoJS.enc.Utf8.parse(getFolderName),
              AccessKey: ACCESS_KEY,
            };
          } else {
            headers = {
              accept: "*/*",
              storageZoneName: BUNNY_STORAGE_ZONE,
              isFolder: false,
              path:
                userData?.newName +
                "-" +
                userData?.userId +
                "/" +
                real_path +
                getNewFileName,
              fileName: CryptoJS.enc.Utf8.parse(getNewFileName),
              AccessKey: ACCESS_KEY,
            };
          }
        } else {
          headers = {
            accept: "*/*",
            storageZoneName: BUNNY_STORAGE_ZONE,
            isFolder: false,
            path: `public/${getNewFileName}`,
            fileName: CryptoJS.enc.Utf8.parse(getNewFileName),
            AccessKey: ACCESS_KEY,
          };
        }

        const encryptedData = encryptDownloadData(headers);
        const response = await fetch(ENV_KEYS.VITE_APP_DOWNLOAD_URL, {
          headers: { encryptedHeaders: encryptedData },
        });
        const reader = response.body!.getReader();
        const stream = new ReadableStream({
          async start(controller) {
            // eslint-disable-next-line no-constant-condition
            while (true) {
              try {
                const { done, value } = await reader.read();

                if (done) {
                  successMessage("Download successful", 3000);
                  setIsHide((prev) => ({
                    ...prev,
                    [index]: false,
                  }));
                  setIsSuccess((prev) => ({
                    ...prev,
                    [index]: true,
                  }));
                  controller.close();
                  break;
                }
                controller.enqueue(value);
              } catch (error: any) {
                errorMessage(error, 2000);
                controller.error(error);
                break;
              }
            }
          },
        });
        const blob = await new Response(stream).blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = getFileName || getFolderName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
      } else {
        errorMessage("Invalid password!!", 3000);
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

  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <React.Fragment>
      {/* <Helmet>
        <meta name="description" content={description}/>
      </Helmet> */}
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
                      setGetFolderName={setGetFolderName}
                      setFilePasswords={setFilePasswords}
                      handleDownloadFolder={handleDownloadFolder}
                      folderSize={folderSize}
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

                                    {dataMultipleFolder.map((folder, index) => {
                                      return (
                                        <MUI.DivDownloadFileBox
                                          sx={{ padding: "5px 0" }}
                                          key={index}
                                        >
                                          <FolderMultipleDownload
                                            index={index}
                                            folderName={
                                              folder?.folder_name || "unknown"
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
                                            setGetFolderName={setGetFolderName}
                                            setFilePasswords={setFilePasswords}
                                            handleDownloadFolder={() =>
                                              handleMultipleDownloadFolder({
                                                folder,
                                                index,
                                              })
                                            }
                                          />
                                        </MUI.DivDownloadFileBox>
                                      );
                                    })}
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
                                      dataFileLink?.queryFileGetLinks?.total ||
                                      0
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

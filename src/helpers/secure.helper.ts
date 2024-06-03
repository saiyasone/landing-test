import { ENV_KEYS } from "constants/env.constant";
import CryptoJS from "crypto-js";

export const encryptData = async (model: any) => {
  const secretKey = ENV_KEYS.REACT_APP_UPLOAD_SECRET_KEY as string;
  const key = CryptoJS.enc.Utf8.parse(secretKey);
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(model), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const cipherText = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  const ivText = iv.toString(CryptoJS.enc.Base64);
  const encryptedData = cipherText + ":" + ivText;
  return encryptedData;
};

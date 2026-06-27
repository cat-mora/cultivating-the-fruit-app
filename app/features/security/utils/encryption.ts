import CryptoJS from "crypto-js";

/**
 * Basic encryption utility for Journal entries.
 * Note: In a full production app, you would use a native AES-GCM implementation
 * and store the key in the Secure Enclave.
 */

const FALLBACK_KEY = "cultivating-the-fruits-secret-key";

export const encryptData = (
  text: string,
  key: string = FALLBACK_KEY,
): string => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

export const decryptData = (
  ciphertext: string,
  key: string = FALLBACK_KEY,
): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

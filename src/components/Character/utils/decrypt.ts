async function generateAESKey(password: string): Promise<CryptoKey> {
  const passwordBuffer = new TextEncoder().encode(password);
  const hashedPassword = await crypto.subtle.digest("SHA-256", passwordBuffer);
  return crypto.subtle.importKey(
    "raw",
    hashedPassword.slice(0, 32),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );
}

export const decryptFile = async (
  url: string,
  password: string
): Promise<ArrayBuffer> => {
  try {
    const response = await fetch(url);
    const encryptedData = await response.arrayBuffer();
    const iv = new Uint8Array(encryptedData.slice(0, 16));
    const data = encryptedData.slice(16);
    
    if (typeof window !== "undefined" && (!window.crypto || !window.crypto.subtle)) {
      throw new Error(
        "Web Crypto API (window.crypto.subtle) is NOT available. " +
        "Note: Web Crypto API requires a secure context (HTTPS) to run on physical mobile devices. " +
        "Please test using the deployed HTTPS Vercel URL!"
      );
    }
    
    const key = await generateAESKey(password);
    return crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
  } catch (err) {
    console.error("Decryption error during model load:", err);
    throw err;
  }
};

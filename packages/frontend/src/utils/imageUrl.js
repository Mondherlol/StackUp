const BACKEND_URL = "http://localhost:9091"; //

export const getBackendImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;

  return `${BACKEND_URL}${imagePath}`;
};

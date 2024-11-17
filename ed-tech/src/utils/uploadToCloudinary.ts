import cloudinary from "@/services/cloudinary";

export const uploadVideoToCloudinary = async (
  fileUri: string,
  folderName: string
) => {
  const res = await cloudinary.uploader.upload(fileUri, {
    resource_type: "video",
    folder: "ed-tech/" + folderName,
  });

  return res;
};

export const uploadImageToCloudinary = async (
  fileUri: string,
  folderName: string
) => {
  const res = await cloudinary.uploader.upload(fileUri, {
    resource_type: "image",
    folder: "ed-tech/" + folderName,
  });

  return res;
};

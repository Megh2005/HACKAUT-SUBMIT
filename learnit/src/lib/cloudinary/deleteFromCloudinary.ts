import cloudinary from "@/lib/cloudinary/config";

export const deleteFromCloudinary = async (publicId: string) => {
  const res = await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: "image",
  });

  return res;
};

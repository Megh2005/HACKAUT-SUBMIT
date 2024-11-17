"use server";

interface EnquiryData {
  name: string;
  email: string;
  message: string;
  [key: string]: any; // Allow additional properties if needed
}

export const submitEnquiry = async (data: EnquiryData): Promise<boolean> => {
  const res = await fetch(process.env.DB_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.ok;
};

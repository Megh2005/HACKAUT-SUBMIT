"use server";

interface EnquiryData {
  name: string;
  email: string;
  phone: string;
  state: string;
  pincode: string;
  message: string;
}

export const submitEnquiry = async (data: EnquiryData) => {
  const res = await fetch(process.env.DB_URL! + "/gurudev-enquiry.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.ok;
};

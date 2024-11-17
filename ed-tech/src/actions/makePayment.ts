"use server";

import sha256 from "crypto-js/sha256";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Purchase } from "@/interfaces/Purchase";

export const makePayment = async (formData: FormData) => {
  const courseId = formData.get("cid") as string;
  const userId = formData.get("userId") as string;
  const amount = formData.get("amount") as string;
  const mobileNumber = formData.get("mobileNumber") as string;

  const transactionId = "Tr-" + Date.now();

  const payload = {
    merchantId: process.env.MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: "MUID-" + Date.now(),
    amount: (parseInt(amount) * 100).toString(),
    redirectUrl: `http://localhost:3000/api/status/${transactionId}`,
    redirectMode: "POST",
    callbackUrl: `http://localhost:3000/api/status/${transactionId}`,
    mobileNumber,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const dataPayload = JSON.stringify(payload);

  const dataBase64 = Buffer.from(dataPayload).toString("base64");

  const fullURL = dataBase64 + "/pg/v1/pay" + process.env.SALT_KEY;
  const dataSha256 = sha256(fullURL);

  const checksum = dataSha256 + "###" + process.env.SALT_INDEX;
  const UAT_PAY_API_URL =
    "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

  const purchasesRef = collection(db, "purchases");

  const newPurchase: Purchase = {
    transactionId,
    courseId,
    purchasedBy: userId,
    status: "PENDING",
    created_at: new Date().toISOString(),
  };

  await addDoc(purchasesRef, newPurchase);

  const response = await axios.post(
    UAT_PAY_API_URL,
    {
      request: dataBase64,
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
    }
  );

  const redirect = response.data.data.instrumentResponse.redirectInfo.url;
  return { url: redirect };
};

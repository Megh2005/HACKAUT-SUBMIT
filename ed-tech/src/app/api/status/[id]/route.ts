import { NextRequest, NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const merchantId = data.get("merchantId");
  const transactionId = data.get("transactionId");

  const st =
    `/pg/v1/status/${merchantId}/${transactionId}` + process.env.SALT_KEY;

  const dataSha256 = sha256(st);

  const checksum = dataSha256 + "###" + process.env.SALT_INDEX;

  const options = {
    method: "GET",
    url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };

  // CHECK PAYMENT STATUS
  const response = await axios.request(options);

  if (response.data.code == "PAYMENT_SUCCESS") {
    const mtid = response.data.data.merchantTransactionId;

    try {
      // Create a query to find the document based on the field and value
      const q = query(
        collection(db, "purchases"),
        where("transactionId", "==", mtid)
      );

      // Get the document snapshot
      const querySnapshot = await getDocs(q);

      // If a document is found, update it
      if (!querySnapshot.empty) {
        const docRef = doc(db, "purchases", querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          status: "SUCCESS",
        });
      }
    } catch (error) {
      console.error("Error updating purchase status:", error);
    }

    return NextResponse.redirect("http://localhost:3000/payment/success", {
      status: 301,
    });
  } else
    return NextResponse.redirect("http://localhost:3000/payment/failure", {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    });
}

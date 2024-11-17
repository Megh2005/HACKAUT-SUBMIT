import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { ActionResponse } from "@/lib/actionResponse";
import { db } from "@/services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getServerSession } from "next-auth";

export const getMyCourses = async () => {
  const purchaseRef = collection(db, "purchases");
  const session = await getServerSession(authOptions);

  if (!session) {
    const res: ActionResponse = {
      data: null,
      message: "Session not found",
      status: "ERROR",
    };
  }

  const querySnapshot = await getDocs(
    query(purchaseRef, where("purchasedBy", "==", session?.user.id))
  );
};

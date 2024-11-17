import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { ApiError } from "@/utils/ApiError";
import { Course } from "@/interfaces/Course";

export async function GET(req: NextRequest) {
  try {
    const purchaseRef = collection(db, "purchases");
    const session = await getServerSession(authOptions);

    const purchases = await getDocs(
      query(
        purchaseRef,
        where("purchasedBy", "==", session?.user.id),
        where("status", "==", "SUCCESS")
      )
    );

    const courseData: (Course & { id: string })[] = [];

    await Promise.all(
      purchases.docs.map(async (p) => {
        const docRef = doc(db, "courses", p.data().courseId);
        const course = await getDoc(docRef);
        courseData.push({ ...(course.data() as Course), id: course.id });
      })
    );

    return NextResponse.json(
      new ApiSuccess(200, "Courses fetched", courseData),
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(new ApiError(500, "Internal Server Error"));
  }
}

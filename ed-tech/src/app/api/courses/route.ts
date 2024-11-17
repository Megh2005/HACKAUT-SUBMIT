import { NextRequest, NextResponse } from "next/server";
import { ActionResponse } from "@/lib/actionResponse";
import { db } from "@/services/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { ApiError } from "@/utils/ApiError";

export async function GET(req: NextRequest) {
  try {
    const coursesRef = collection(db, "courses");
    const coursesQuery = query(coursesRef, orderBy("created_at", "desc"));
    const courses = await getDocs(coursesQuery);

    const data = courses.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return NextResponse.json(new ApiSuccess(200, "Courses fetched", data), {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(new ApiError(500, "Something went wrong"), {
      status: 500,
    });
  }
}

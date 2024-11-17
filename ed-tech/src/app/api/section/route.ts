import { db } from "@/services/firebase";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const courseId = searchParams.get("cid");
    const sectionId = searchParams.get("sid") as string;

    if (!courseId) {
      return NextResponse.json(new ApiError(400, "Course ID is required"), {
        status: 400,
      });
    }

    const docRef = doc(db, "courses", courseId);
    const course = await getDoc(docRef);

    if (!course.exists()) {
      return NextResponse.json(new ApiError(404, "Course not found"), {
        status: 404,
      });
    }

    const data = course.data();

    const section = data.sections.find(
      (section: any) => section.id === parseInt(sectionId)
    );

    if (!section) {
      return NextResponse.json(new ApiError(404, "Section not found"), {
        status: 404,
      });
    }

    return NextResponse.json(new ApiSuccess(200, "Section found", section), {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(new ApiError(500, "Internal Server Error"), {
      status: 500,
    });
  }
}

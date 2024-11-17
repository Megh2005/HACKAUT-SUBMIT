import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const url = new URL(req.url);
    const courseId = url.pathname.split("/").pop();

    if (!courseId) throw new Error("Course ID is required");

    const user = await getDoc(doc(db, "users", session.user.id!));
    if (!user.exists()) throw new Error("User not found");

    const course = await getDoc(doc(db, "courses", courseId));
    if (!course.exists()) throw new Error("Course not found");

    return NextResponse.json({
      data: {
        user: user.data(),
        course: course.data(),
      },
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { data: { error: error.message }, success: false },
      { status: 500 }
    );
  }
}

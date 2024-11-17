import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectDB } from "@/lib/db";
import { QuizModel } from "@/models/quiz.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }

    if (!id) {
      return NextResponse.json(new ApiError(400, "Invalid request body"), {
        status: 400,
      });
    }

    const quiz = await QuizModel.findById(id);
    if (!quiz) {
      return NextResponse.json(new ApiError(404, "Quiz not found"), {
        status: 404,
      });
    }

    if (quiz.generatedBy.toString() !== session.user._id!.toString()) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }

    await QuizModel.findByIdAndDelete(id);

    return NextResponse.json(
      new ApiSuccess(200, "Quiz deleted successfully", null),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}

import { connectDB } from "@/lib/db";
import { QuizModel } from "@/models/quiz.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { questions, answers, notebook, title } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }
    const userId = session.user._id;

    if (!questions || !answers) {
      return NextResponse.json(new ApiError(400, "Invalid request body"), {
        status: 400,
      });
    }

    const quiz = await QuizModel.create({
      questions,
      userAnswers: answers,
      notebook,
      generatedBy: userId,
      title,
    });

    if (!quiz) {
      return NextResponse.json(new ApiError(500, "Error saving quiz"), {
        status: 500,
      });
    }

    return NextResponse.json(
      new ApiSuccess(201, "Quiz saved successfully", quiz),
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(new ApiError(500, "Something went wrong"), {
      status: 500,
    });
  }
}

import { connectDB } from "@/lib/db";
import { QuizModel } from "@/models/quiz.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }
    const userId = session.user._id;

    const url = new URL(req.url);
    const notebookId = url.pathname.split("/").pop()?.split("?")[0] as string;
    const page = parseInt(url.searchParams.get("page") as string);
    const pageSize = parseInt(url.searchParams.get("pageSize") as string) || 10;
    const filter = (url.searchParams.get("filter") as string) || "";

    if (!notebookId) {
      return NextResponse.json(new ApiError(400, "Notebook ID is required"), {
        status: 400,
      });
    }

    const quizzes = await QuizModel.aggregate([
      {
        $match: {
          title: { $regex: filter, $options: "i" },
          generatedBy: new mongoose.Types.ObjectId(userId),
          notebook: new mongoose.Types.ObjectId(notebookId),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
      {
        $project: {
          data: 1,
          totalCount: {
            $ifNull: [{ $arrayElemAt: ["$metadata.totalCount", 0] }, 0],
          },
        },
      },
    ]);

    const response = {
      data: quizzes[0].data,
      metadata: {
        totalCount: quizzes[0].totalCount,
        page,
        pageSize,
        hasNextPage: quizzes[0].totalCount - page * pageSize > 0,
      },
    };

    return NextResponse.json(new ApiSuccess(200, "Quizzes found", response), {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

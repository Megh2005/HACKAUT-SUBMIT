import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiError } from "@/utils/ApiError";
import { DiscussionModel } from "@/models/discussion.model";
import mongoose from "mongoose";
import { ApiSuccess } from "@/utils/ApiSuccess";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") as string);
    const pageSize = 10;
    const filter = url.searchParams.get("filter");

    const discussions = await DiscussionModel.aggregate([
      {
        $match: {
          title: { $regex: filter, $options: "i" },
          askedBy: new mongoose.Types.ObjectId(session.user._id),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
              $lookup: {
                from: "users",
                localField: "askedBy",
                foreignField: "_id",
                as: "askedBy",
              },
            },
            {
              $unwind: "$askedBy",
            },
            {
              $project: {
                title: 1,
                description: 1,
                tags: 1,
                askedBy: {
                  _id: 1,
                  displayName: 1,
                  profilePhoto: 1,
                },
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
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
      data: discussions[0].data,
      metadata: {
        totalCount: discussions[0].totalCount,
        page,
        pageSize,
        hasNextPage: discussions[0].totalCount - page * pageSize > 0,
      },
    };

    return NextResponse.json(
      new ApiSuccess(200, "Discussions fetched successfully", response),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

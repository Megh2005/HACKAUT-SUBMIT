import { connectDB } from "@/lib/db";
import { ReplyModel } from "@/models/reply.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }
    const userId = session.user._id;

    const { content, discussionId, replyId } = await req.json();

    if (!discussionId && !replyId) {
      return NextResponse.json(
        new ApiError(400, "Discussion ID or Reply ID is required"),
        {
          status: 400,
        }
      );
    }

    if (!content) {
      return NextResponse.json(new ApiError(400, "Content is required"), {
        status: 400,
      });
    }

    let reply;

    if (discussionId) {
      reply = await ReplyModel.create({
        content,
        discussionId,
        repliedBy: userId,
      });
    } else {
      reply = await ReplyModel.create({
        content,
        replyId,
        repliedBy: userId,
      });
    }

    if (!reply) {
      return NextResponse.json(new ApiError(400, "Reply not created"), {
        status: 400,
      });
    }

    return NextResponse.json(new ApiSuccess(201, "Reply created", reply), {
      status: 201,
    });
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }
    const userId = session.user._id;

    const discussionId = url.searchParams.get("discussionId");
    const replyId = url.searchParams.get("replyId");
    const page = parseInt(url.searchParams.get("page") as string);
    const pageSize = 10;

    if (!discussionId && !replyId) {
      return NextResponse.json(
        new ApiError(400, "Discussion ID or Reply ID is required"),
        {
          status: 400,
        }
      );
    }

    const id = (discussionId || replyId) as string;

    const replies = await ReplyModel.aggregate([
      {
        $match: {
          $or: [
            { discussionId: new mongoose.Types.ObjectId(id) },
            { replyId: new mongoose.Types.ObjectId(id) },
          ],
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
                localField: "repliedBy",
                foreignField: "_id",
                as: "repliedBy",
              },
            },
            {
              $lookup: {
                from: "replies",
                localField: "_id",
                foreignField: "replyId",
                as: "replies",
              },
            },
            {
              $addFields: {
                replyCount: { $size: "$replies" },
                userReaction: {
                  $cond: [
                    { $in: [new mongoose.Types.ObjectId(userId!), "$likes"] },
                    "like",
                    {
                      $cond: [
                        {
                          $in: [
                            new mongoose.Types.ObjectId(userId!),
                            "$dislikes",
                          ],
                        },
                        "dislike",
                        null,
                      ],
                    },
                  ],
                },
                reactionCount: {
                  $subtract: [{ $size: "$likes" }, { $size: "$dislikes" }],
                },
              },
            },
            {
              $unwind: "$repliedBy",
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
      data: replies[0].data,
      metadata: {
        totalCount: replies[0].totalCount,
        page,
        pageSize,
        hasNextPage: replies[0].totalCount - page * pageSize > 0,
      },
    };

    return NextResponse.json(new ApiSuccess(200, "Replies fetched", response), {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

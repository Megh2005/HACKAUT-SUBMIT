import { connectDB } from "@/lib/db";
import { NoteBookModel } from "@/models/notebook.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const data = await req.json();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }
    const userId = session.user._id;

    if (!data) {
      return NextResponse.json(new ApiError(400, "Invalid request body"), {
        status: 400,
      });
    }

    const newNotebook = await NoteBookModel.create({
      name: data.name,
      createdBy: userId,
    });

    if (!newNotebook) {
      return NextResponse.json(new ApiError(400, "Error creating notebook"), {
        status: 400,
      });
    }

    return NextResponse.json(
      new ApiSuccess(201, "Notebook created successfully", newNotebook),
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

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
    const page = parseInt(url.searchParams.get("page") as string);
    const pageSize = 10;
    const query = (url.searchParams.get("q") as string) || "";

    if (!userId) {
      return NextResponse.json(new ApiError(400, "Unauthorized"), {
        status: 400,
      });
    }

    const notebooks = await NoteBookModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          name: { $regex: query, $options: "i" },
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
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
                pipeline: [
                  {
                    $project: { password: -1 },
                  },
                ],
              },
            },
            {
              $unwind: "$createdBy",
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
      data: notebooks[0].data,
      metadata: {
        totalCount: notebooks[0].totalCount,
        page,
        pageSize,
        hasNextPage: notebooks[0].totalCount - page * pageSize > 0,
      },
    };

    return NextResponse.json(
      new ApiSuccess(200, "Notebooks fetched successfully", response),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

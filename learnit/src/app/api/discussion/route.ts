import { connectDB } from "@/lib/db";
import { DiscussionModel } from "@/models/discussion.model";
import { discussionSchema, tagSchema } from "@/schemas/DiscussionSchema";
import { newDiscussion } from "@/types/DiscussionRequestBody";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadToCloudinary";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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

    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const tags = JSON.parse(formData.get("tags") as string);
    const attachment = formData.get("attachment") as File | null;

    const { success } = discussionSchema.safeParse({
      title,
      description,
    });

    const { success: tagSuccess } = tagSchema.safeParse(tags);

    if (!success || !tagSuccess) {
      return NextResponse.json(new ApiError(400, "Invalid request body"), {
        status: 400,
      });
    }

    // upload attachment to cloudinary

    let attachmentUrl = null;

    if (attachment) {
      const fileBuffer = await attachment.arrayBuffer();

      const mimeType = attachment.type;
      const encoding = "base64";
      const base64Data = Buffer.from(fileBuffer).toString("base64");

      // this will be used to upload the file
      const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

      const res = await uploadToCloudinary(fileUri, "attachments");

      if (!res) {
        return NextResponse.json(
          new ApiError(500, "Failed to upload attachment"),
          {
            status: 500,
          }
        );
      }

      attachmentUrl = res.secure_url;
    }

    const newDiscussion = await DiscussionModel.create({
      title,
      description,
      tags,
      askedBy: session.user._id,
      attachment: attachmentUrl,
    });

    if (!newDiscussion) {
      return NextResponse.json(
        new ApiError(500, "Failed to create discussion"),
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      new ApiSuccess(201, "Discussion created successfully", null),
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") as string);
    const pageSize = 10;
    const filter = url.searchParams.get("filter");

    const discussions = await DiscussionModel.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: filter || "", $options: "i" } },
            { tags: { $regex: filter || "", $options: "i" } },
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
  } catch (error) {
    return NextResponse.json(new ApiError(500, "Internal Server Error"), {
      status: 500,
    });
  }
}

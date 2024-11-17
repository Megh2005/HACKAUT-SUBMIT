import { connectDB } from "@/lib/db";
import { DiscussionModel } from "@/models/discussion.model";
import { UserModel } from "@/models/user.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { discussionSchema, tagSchema } from "@/schemas/DiscussionSchema";
import { uploadToCloudinary } from "@/lib/cloudinary/uploadToCloudinary";
import { deleteFromCloudinary } from "@/lib/cloudinary/deleteFromCloudinary";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/")[3];
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }

    const discussion = await DiscussionModel.findById(id).populate({
      path: "askedBy",
      model: UserModel,
      select: "displayName profilePhoto _id reputation email",
    });

    if (!discussion) {
      return NextResponse.json(new ApiError(404, "Discussion not found"), {
        status: 404,
      });
    }

    let userReaction = null;

    if (discussion) {
      if (discussion.likes.some((id) => id.toString() === session?.user._id)) {
        userReaction = "like";
      } else if (
        discussion.dislikes.some((id) => id.toString() === session?.user._id)
      ) {
        userReaction = "dislike";
      }
    }

    return NextResponse.json(
      new ApiSuccess(200, "Discussion fetched successfully", {
        discussion,
        userReaction,
        reactionCount: discussion.likes.length - discussion.dislikes.length,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();

  const transaction = await mongoose.startSession();

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const session = await getServerSession(authOptions);

    if (!id) {
      return NextResponse.json(new ApiError(400, "Discussion ID is required"), {
        status: 400,
      });
    }

    if (!session?.user) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }

    const discussion = await DiscussionModel.findById(id);

    if (!discussion) {
      return NextResponse.json(new ApiError(404, "Discussion not found"), {
        status: 404,
      });
    }

    if (discussion.askedBy.toString() !== session.user._id!.toString()) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }

    transaction.startTransaction();

    if (discussion.attachment !== null || discussion.attachment !== "") {
      const attachmentPublicId =
        "learnit" +
        discussion.attachment!.split("learnit").pop()!.split(".")[0];

      await deleteFromCloudinary(attachmentPublicId);
    }

    await DiscussionModel.findByIdAndDelete(id);

    await transaction.commitTransaction();

    return NextResponse.json(
      new ApiSuccess(200, "Discussion deleted successfully", discussion),
      { status: 200 }
    );
  } catch (error: any) {
    await transaction.abortTransaction();
    return NextResponse.json(new ApiError(500, error.message), {
      status: 500,
    });
  } finally {
    await transaction.endSession();
  }
}

export async function PATCH(req: NextRequest) {
  await connectDB();

  const transaction = await mongoose.startSession();

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const session = await getServerSession(authOptions);

    if (!id) {
      return NextResponse.json(new ApiError(400, "Discussion ID is required"), {
        status: 400,
      });
    }
    if (!session?.user) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }

    const discussion = await DiscussionModel.findById(id);

    if (!discussion) {
      return NextResponse.json(new ApiError(404, "Discussion not found"), {
        status: 404,
      });
    }

    if (discussion.askedBy.toString() !== session.user._id!.toString()) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const tags = JSON.parse(formData.get("tags") as string);
    const attachment = formData.get("attachment") as File | null;
    const imageSrc = formData.get("imageSrc") as string;

    console.log(imageSrc);

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

    transaction.startTransaction();

    let attachmentUrl = null;

    console.log(attachment);

    if (attachment) {
      console.log("Attachment hai");
      const fileBuffer = await attachment!.arrayBuffer();

      const mimeType = attachment!.type;
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

      console.log(discussion.attachment);

      if (discussion.attachment !== null) {
        console.log("old attachment hai");
        const attachmentPublicId =
          "learnit" +
          discussion.attachment!.split("learnit").pop()!.split(".")[0];

        await deleteFromCloudinary(attachmentPublicId);
      }
    } else {
      console.log("Attachment nahi hai");
      if (discussion.attachment !== null) {
        const attachmentPublicId =
          "learnit" +
          discussion.attachment!.split("learnit").pop()!.split(".")[0];

        await deleteFromCloudinary(attachmentPublicId);
      }
    }

    const updatedDiscussion = await DiscussionModel.findByIdAndUpdate(id, {
      title,
      description,
      tags,
      attachment: attachmentUrl,
    });

    if (!updatedDiscussion) {
      return NextResponse.json(
        new ApiError(500, "Failed to update discussion"),
        {
          status: 500,
        }
      );
    }

    await transaction.commitTransaction();

    return NextResponse.json(
      new ApiSuccess(200, "Discussion updated successfully", updatedDiscussion),
      { status: 200 }
    );
  } catch (error: any) {
    await transaction.abortTransaction();
    return NextResponse.json(new ApiError(500, error.message), {
      status: 500,
    });
  } finally {
    await transaction.endSession();
  }
}

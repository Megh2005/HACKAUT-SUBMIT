import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectDB } from "@/lib/db";
import { ReplyModel } from "@/models/reply.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/")[4];

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }
    const userId = session.user._id;

    // check if dislike already exists

    const existingDislike = await ReplyModel.findOne({
      _id: id,
      dislikes: userId,
    });

    if (existingDislike) {
      await ReplyModel.findByIdAndUpdate(id, {
        $pull: { dislikes: userId },
      });
    } else {
      await ReplyModel.updateOne(
        { _id: id },
        {
          $push: { dislikes: userId },
        }
      );
    }

    await ReplyModel.findByIdAndUpdate(id, {
      $pull: { likes: userId },
    });

    return NextResponse.json(
      new ApiSuccess(200, "Disliked successfully", null),
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

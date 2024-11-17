import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectDB } from "@/lib/db";
import { DiscussionModel } from "@/models/discussion.model";
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
    // check if like already exists

    const existingLike = await DiscussionModel.findOne({
      _id: id,
      likes: userId,
    });

    if (existingLike) {
      await DiscussionModel.findByIdAndUpdate(id, {
        $pull: { likes: userId },
      });
    } else {
      await DiscussionModel.updateOne(
        { _id: id },
        {
          $push: { likes: userId },
        }
      );
    }

    await DiscussionModel.findByIdAndUpdate(id, {
      $pull: { dislikes: userId },
    });

    return NextResponse.json(new ApiSuccess(200, "Liked successfully", null), {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}

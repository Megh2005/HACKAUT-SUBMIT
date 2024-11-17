import { connectDB } from "@/lib/db";
import { ReplyModel } from "@/models/reply.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const replyId = url.pathname.split("/").pop();

    if (!replyId) {
      return NextResponse.json(new ApiError(400, "Reply ID is required"), {
        status: 400,
      });
    }

    const deletedReply = await ReplyModel.findByIdAndUpdate(
      replyId,
      {
        status: "deleted",
        content: "deleted",
      },
      { new: true }
    );

    if (!deletedReply) {
      return NextResponse.json(new ApiError(404, "Error deleting reply"), {
        status: 404,
      });
    }

    return NextResponse.json(
      new ApiSuccess(200, "Reply deleted", deletedReply),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const replyId = url.pathname.split("/").pop();

    if (!replyId) {
      return NextResponse.json(new ApiError(400, "Reply ID is required"), {
        status: 400,
      });
    }

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(new ApiError(400, "Content is required"), {
        status: 400,
      });
    }

    const updatedReply = await ReplyModel.findByIdAndUpdate(
      replyId,
      { content, status: "edited" },
      { new: true }
    );

    if (!updatedReply) {
      return NextResponse.json(new ApiError(404, "Error updating reply"), {
        status: 404,
      });
    }

    return NextResponse.json(
      new ApiSuccess(200, "Reply updated", updatedReply),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

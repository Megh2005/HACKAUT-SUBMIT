import { connectDB } from "@/lib/db";
import { NoteBookModel } from "@/models/notebook.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { SummaryModel } from "@/models/summary.model";
import { QuizModel } from "@/models/quiz.model";

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
    const notebookId = url.pathname.split("/")[3];

    if (!userId) {
      return NextResponse.json(new ApiError(400, "Unauthorized"), {
        status: 400,
      });
    }

    const notebook = await NoteBookModel.findOne({
      _id: notebookId,
      createdBy: userId,
    });

    if (!notebook) {
      return NextResponse.redirect(new URL("/u/notebooks", req.url));
    }

    return NextResponse.json(new ApiSuccess(200, "Notebook found", notebook), {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);
    const { name: notebookName } = await req.json();

    const url = new URL(req.url);
    const notebookId = url.pathname.split("/").pop();

    if (!session?.user) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }

    const notebook = await NoteBookModel.findById(notebookId);

    if (!notebook) {
      return NextResponse.json(new ApiError(404, "Notebook not found"), {
        status: 404,
      });
    }

    if (notebook.createdBy.toString() !== session.user._id!.toString()) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }

    const updatedNotebook = await NoteBookModel.findByIdAndUpdate(
      notebookId,
      {
        name: notebookName,
      },
      { new: true }
    );

    return NextResponse.json(
      new ApiSuccess(200, "Notebook updated", updatedNotebook),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const transaction = await mongoose.startSession();

  try {
    const url = new URL(req.url);
    const notebookId = url.pathname.split("/").pop();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }

    const notebook = await NoteBookModel.findById(notebookId);

    if (!notebook) {
      return NextResponse.json(new ApiError(404, "Notebook not found"), {
        status: 404,
      });
    }

    if (notebook.createdBy.toString() !== session.user._id!.toString()) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }

    transaction.startTransaction();

    await NoteBookModel.deleteOne({ _id: notebookId });

    await SummaryModel.deleteMany({ notebook: notebookId });

    await QuizModel.deleteMany({ notebook: notebookId });

    await transaction.commitTransaction();

    return NextResponse.json(new ApiSuccess(200, "Notebook deleted", null), {
      status: 200,
    });
  } catch (error: any) {
    await transaction.abortTransaction();
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  } finally {
    await transaction.endSession();
  }
}

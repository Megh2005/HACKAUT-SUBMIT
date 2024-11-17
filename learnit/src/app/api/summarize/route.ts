import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { ApiError } from "@/utils/ApiError";
import { SummaryModel } from "@/models/summary.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

function fileToGenerativePart(base64Data: string, mimeType: string) {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(new ApiError(401, "Unauthorized"), {
        status: 401,
      });
    }
    const userId = session.user._id;

    const formData = await req.formData();
    const notebookId = formData.get("notebookId") as string;

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const mediaPath = formData.get("mediaPath") as File;
    const buffer = Buffer.from(await mediaPath.arrayBuffer());
    const base64Data = buffer.toString("base64");

    const prompt = `
    Please analyze the provided image and generate a concise summary of its educational content. Focus on all the key points. The output should be formatted as given in the example, an array in which the first element is the topic and the rest are the key points.
  
    **Example:**

    ["The Solar System", "The Sun is at the center", "There are eight planets", "The planets are divided into two groups: terrestrial and gas giants"]
  
    **End of Example:**
  
    If the image does not contain any educational content return null in the response like this: null
    `;

    const imagePart = fileToGenerativePart(base64Data, mediaPath.type);

    const result = await model.generateContent([prompt, imagePart]);

    if (result.response.text() !== "null") {
      await SummaryModel.create({
        content: result.response.text(),
        generatedBy: userId,
        notebook: notebookId,
      });
    }

    return NextResponse.json(
      new ApiSuccess(200, "Success", result.response.text())
    );
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}

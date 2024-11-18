import { connectDB } from "@/lib/db";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const fd = await req.formData();
    const recommendationInfo = {
      skills: fd.get("skills") as string,
      lvlOfExp: fd.get("levelOfExperience") as string,
      cmtTime: fd.get("commitmentTime") as string,
    };

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
          You are an expert in recommending courses based on the following information:
          - Skills: ${recommendationInfo.skills}
          - Level of Experience: ${recommendationInfo.lvlOfExp}
          - Commitment Time: ${recommendationInfo.cmtTime}

          Please generate a list of recommended courses, resouces, articles, etc. based on the provided information.
        `;

    const result = await model.generateContent(prompt);

    return NextResponse.json(
      new ApiSuccess(200, "Recommendation generated", result.response.text()),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      new ApiError(500, error instanceof Error ? error.message : String(error)),
      { status: 500 }
    );
  }
}

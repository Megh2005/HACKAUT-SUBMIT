import { connectDB } from "@/lib/db";
import { SummaryModel } from "@/models/summary.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { parseData } from "@/utils/parseSummaryData";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const formData = await req.formData();

    const summaries = formData.getAll("summary-id");
    const summaryContent = [] as string[];

    await Promise.all(
      summaries.map(async (id) => {
        const summary = await SummaryModel.findOne({ _id: id });
        if (summary) {
          const { points } = parseData(summary.content);
          summaryContent.push(...points);
        }
      })
    );

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      
      Please generate a quiz (10 questions) based on the provided points in the following list and if necessary include some questions that are not in the list but are related to the content: ${summaryContent}. The output should be structured as given in the example.

      **Example:**
      
      {
        title: Title of the Quiz,
        questions: [
          {
            "id": 1,
            "question": "Question 1",
            "answers": [
              "Answer 1",
              "Answer 2",
              "Answer 3"
            ],
            "correctAnswer": 0
          },
          {
            "id": 2,
            "question": "Question 2",
            "answers": [
              "Answer 1",
              "Answer 2",
              "Answer 3"
            ],
            "correctAnswer": 1
          }
        ]
      }
      
      **End of Example**

      The correctAnswer is the index of the correct answer in the answers array. Increase the difficulty of the quiz if necessary with each question.

      `;

    const result = await model.generateContent(prompt);

    if (result.response.text().length > 0) {
      return NextResponse.json(
        new ApiSuccess(
          200,
          "Quiz generated successfully",
          JSON.parse(
            result.response
              .text()
              .replace(/```json\s*/, "")
              .replace(/\s*```$/, "")
          )
        )
      );
    }

    return NextResponse.json(new ApiError(404, "Failed to generate quiz"), {
      status: 404,
    });
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}

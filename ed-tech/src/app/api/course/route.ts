import { db } from "@/services/firebase";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { Course } from "@/interfaces/Course";
import {
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "@/utils/uploadToCloudinary";
import { getServerSession } from "next-auth";
import { ActionResponse } from "@/lib/actionResponse";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const courseId = searchParams.get("cid");
    const session = await getServerSession(authOptions);

    if (!courseId) {
      return NextResponse.json(new ApiError(400, "Course ID is required"), {
        status: 400,
      });
    }

    const docRef = doc(db, "courses", courseId);
    const course = await getDoc(docRef);

    if (!course.exists()) {
      return NextResponse.json(new ApiError(404, "Course not found"), {
        status: 404,
      });
    }

    const data = {
      ...course.data(),
      id: course.id,
      isPurchased: false,
    };

    // check if course already bought
    const purchaseRef = collection(db, "purchases");

    const purchases = await getDocs(
      query(
        purchaseRef,
        where("purchasedBy", "==", session?.user.id),
        where("courseId", "==", courseId)
      )
    );

    if (purchases.docs.length > 0) {
      data.isPurchased = true;
    }

    return NextResponse.json(new ApiSuccess(200, "Course found", data), {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(new ApiError(500, "Internal Server Error"), {
      status: 500,
    });
  }
}

interface FormDataObject {
  [key: string]: string | File | FormDataObject | Array<string | File>;
}

const extractFormData = (formData: FormData): FormDataObject => {
  const data: FormDataObject = {};

  formData.forEach((value, key) => {
    // Handle nested objects and arrays based on key format
    const keyParts = key.split(/[\[\]]/).filter(Boolean);
    let current = data;

    keyParts.forEach((part, index) => {
      if (index === keyParts.length - 1) {
        if (Array.isArray(current[part])) {
          (current[part] as Array<string | File>).push(value);
        } else if (typeof current[part] !== "undefined") {
          current[part] = [current[part] as string | File, value];
        } else {
          current[part] = value;
        }
      } else {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part] as FormDataObject;
      }
    });
  });

  return data;
};

const getFileUri = async (file: File) => {
  const fileBuffer = await file.arrayBuffer();

  const mimeType = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(fileBuffer).toString("base64");

  // this will be used to upload the file
  return "data:" + mimeType + ";" + encoding + "," + base64Data;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data = extractFormData(formData);
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      const res: ActionResponse = {
        status: "ERROR",
        message: "User Id is required",
        data: null,
      };
      return NextResponse.json(res, { status: 400 });
    }

    if (session?.user.role !== "creator") {
      const res: ActionResponse = {
        status: "ERROR",
        message: "You are not authorized to perform this action",
        data: null,
      };
      return NextResponse.json(res, { status: 400 });
    }

    const course_data: Course = {
      title: "",
      description: "",
      price: "",
      thumbnailUrl: "",
      created_at: "",
      updated_at: "",
      createdBy: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
      },
      sections: [],
    };

    let sectionId = 1;
    for (const [_key, value] of Object.entries(data.sections)) {
      const section = value as FormDataObject;
      const video = section.video as File;
      const title = section.title as string;

      const videoUri = await getFileUri(video);
      const res = await uploadVideoToCloudinary(videoUri, "sections");

      course_data.sections.push({
        title: title,
        videoUrl: res.secure_url,
        duration: res.duration,
        id: sectionId,
      });

      sectionId++;
    }

    const thumbnailUri = await getFileUri(data.thumbnail as File);
    const thumbnail_url = await uploadImageToCloudinary(
      thumbnailUri,
      "thumbnails"
    );

    course_data.title = data.title as string;
    course_data.description = data.description as string;
    course_data.price = data.price as string;
    course_data.thumbnailUrl = thumbnail_url.secure_url;
    course_data.created_at = new Date().toISOString();
    course_data.updated_at = new Date().toISOString();

    const docRef = doc(db, "users", userId);

    const res = await getDoc(docRef);
    const userData = res.data();

    if (!userData) {
      const res: ActionResponse = {
        status: "ERROR",
        message: "User not found",
        data: null,
      };
      return NextResponse.json(res, { status: 400 });
    }

    course_data.createdBy = {
      id: userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    };

    const newCourse = await addDoc(collection(db, "courses"), course_data);

    if (!newCourse.id) {
      const res: ActionResponse = {
        status: "ERROR",
        message: "An error occurred while creating the course",
        data: null,
      };
      return NextResponse.json(res, { status: 400 });
    }

    const response: ActionResponse = {
      status: "SUCCESS",
      message: "Course created successfully",
      data: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ActionResponse = {
      status: "ERROR",
      message: "An error occurred while creating the course",
      data: null,
    };
    return NextResponse.json(response, { status: 400 });
  }
}

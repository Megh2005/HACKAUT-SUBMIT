"use server";

import { User } from "@/interfaces/User";
import { ActionResponse } from "@/lib/actionResponse";
import { db } from "@/services/firebase";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import bcrypt from "bcryptjs";

export const signup = async (user: User) => {
  try {
    const usersRef = collection(db, "users");

    // check if user already exists

    const results = await getDocs(
      query(usersRef, where("email", "==", user.email))
    );

    if (!results.empty) {
      const res: ActionResponse = {
        status: "ERROR",
        message: "User already exists",
        data: null,
      };
      return res;
    }

    // create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const newUser: User = {
      ...user,
      password: hashedPassword,
    };

    const result = await addDoc(usersRef, newUser);

    if (result.id) {
      const res: ActionResponse = {
        status: "SUCCESS",
        message: "User signed up successfully",
        data: null,
      };
      return res;
    }
  } catch (error) {
    const res: ActionResponse = {
      status: "ERROR",
      message: "An error occurred",
      data: null,
    };
    return res;
  }
};

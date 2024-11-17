import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const usersRef = collection(db, "users");

          const results = await getDocs(
            query(usersRef, where("email", "==", credentials.email))
          );

          if (results.empty) {
            throw new Error("No user found");
          }

          const user = results.docs[0].data();
          const userId = results.docs[0].id;

          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordMatch) {
            return { id: userId, ...user };
          } else {
            throw new Error("Invalid password");
          }
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString();
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET,
};

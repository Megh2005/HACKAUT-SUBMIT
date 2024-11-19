"use client";

import { motion } from "framer-motion"; // Importing Framer Motion
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

export default function Home() {
  const { fullName, setFullName } = useUser();
  const [roomID, setRoomID] = useState("");
  const router = useRouter();

  useEffect(() => {
    setFullName("");
  }, []);

  return (
    <div className="w-full h-full">
      <section className="bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-32 flex-col gap-24 flex h-screen items-center">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="bg-gradient-to-r capitalize pb-10 from-green-300 via-blue-500 to-purple-600 bg-clip-text font-extrabold text-transparent text-6xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              Your Guru Gyan Meeting Is Here
            </motion.h1>

            <motion.div
              className="flex items-center justify-center gap-4 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <input
                type="text"
                id="name"
                onChange={(e) => setFullName(e.target.value.toString())}
                className="border rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2 w-[30vw] text-black"
                placeholder="Enter Your Name"
              />
            </motion.div>

            {fullName && fullName.length >= 3 && (
              <>
                <motion.div
                  className="flex items-center justify-center gap-4 mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <input
                    type="text"
                    id="roomid"
                    value={roomID}
                    onChange={(e) => setRoomID(e.target.value)}
                    className="border rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2 w-full text-yellow-400"
                    placeholder="Enter Meeting ID"
                  />
                  <motion.button
                    className="rounded-md bg-blue-600 w-full px-10 py-[11px] text-sm font-medium text-white hover:bg-blue-500 focus:outline-none transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/room/${roomID}`)}
                    disabled={!roomID}
                  >
                    Join Discussion
                  </motion.button>
                </motion.div>
                <motion.div
                  className="mt-4 flex items-center justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <motion.button
                    className="text-lg italic underline font-medium text-yellow-300 hover:text-blue-400 hover:underline transition-all"
                    whileHover={{ color: "#38bdf8", scale: 1.05 }}
                    onClick={() => router.push(`/room/${uuid()}`)}
                  >
                    or Distribute Your Gyan
                  </motion.button>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

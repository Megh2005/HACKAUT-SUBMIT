"use client";

import React, { useState } from "react";

const VerifyCertificate = () => {
  const [verifyInfo, setVerifyInfo] = useState<{
    imgFile: File | null;
    authHash: string;
  }>();
  const [status, setStatus] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isValidHash = (hash: string) => {
    const hashPattern = /^0x[a-fA-F0-9]{64}$/;
    return hashPattern.test(hash);
  };

  const onSubmit = async () => {
    if (!verifyInfo || !verifyInfo.imgFile || !verifyInfo.authHash) {
      setStatus({
        message: "Please provide both an image file and a hash.",
        type: "error",
      });
      return;
    }

    if (!isValidHash(verifyInfo.authHash)) {
      setStatus({
        message: "Invalid hash format. Please provide a valid Ethereum hash.",
        type: "error",
      });
      return;
    }

    setStatus({ message: "", type: "" }); // Clear previous messages
    setIsLoading(true); // Start loading
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

    // Simulate success or error (replace this logic with actual verification logic)
    const isVerified = Math.random() > 0.5; // Example: 50% chance of success

    if (isVerified) {
      setStatus({ message: "Verification successful!", type: "success" });
    } else {
      setStatus({
        message: "Error verifying. Please try again.",
        type: "error",
      });
    }
    setIsLoading(false); // End loading
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 rounded-sm overflow-hidden px-4">
      <h1 className="text-3xl text-center font-bold text-white">Verify</h1>
      <div className="w-full max-w-xl mx-auto mt-6">
        <input
          className="file-input file-input-bordered w-full"
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              setVerifyInfo((p) => ({
                imgFile: files[0],
                authHash: p?.authHash || "",
              }));
            }
          }}
        />
      </div>
      <div className="w-full max-w-xl mx-auto mt-6">
        <input
          placeholder="Authentication Hash"
          className="input input-bordered w-full"
          type="text"
          onChange={(e) =>
            setVerifyInfo((p) => ({
              imgFile: p?.imgFile || null,
              authHash: e.target.value,
            }))
          }
        />
      </div>
      {status.message && (
        <div className="w-full max-w-xl mx-auto mt-4">
          <p
            className={`text-${
              status.type === "success" ? "green" : "red"
            }-500`}
          >
            {status.message}
          </p>
        </div>
      )}
      <div className="w-full max-w-xl mx-auto mt-6">
        <button
          onClick={onSubmit}
          className={`btn ${isLoading ? "btn-disabled" : "btn-primary"}`}
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default VerifyCertificate;

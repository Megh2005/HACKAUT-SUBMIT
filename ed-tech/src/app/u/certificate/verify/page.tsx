"use client";

import React, { useState } from "react";

const VerifyCertificate = () => {
  const [verifyInfo, setVerifyInfo] = useState<{
    imgFile: File | null;
    authHash: string;
  }>();

  const onSubmit = () => {
    if (!verifyInfo || !verifyInfo.imgFile || !verifyInfo.authHash) return;
    console.log(verifyInfo);
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
      <div className="w-full max-w-xl mx-auto mt-6">
        <button onClick={onSubmit} className="btn btn-primary">
          Submit
        </button>
      </div>
    </div>
  );
};

export default VerifyCertificate;

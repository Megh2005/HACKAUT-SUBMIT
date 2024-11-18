"use client";

import Certificate from "@/components/Certificate";
import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import abi from "@/app/abi";
import { useAccount, useWriteContract } from "wagmi";

const contractAddress = "0x4b4Ca68B251E0349dF9A1FFa18AF3A4748c94A9c";

const CertificatePage = ({ params }: { params: { id: string } }) => {
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const account = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Function to mint certificate
  async function MintCertificate(tokenUri: string) {
    try {
      const tx = await writeContractAsync({
        abi: abi,
        address: contractAddress,
        functionName: "mintCertificate",
        args: [tokenUri],
      });
      console.log("Transaction successful!", tx);
    } catch (error) {
      console.error("Error during minting transaction:", error);
    }
  }

  // Handle minting process
  async function handleMint() {
    setLoading(true);

    if (!ref.current) {
      console.error("Reference to the certificate DOM element is null.");
      setLoading(false);
      return;
    }

    try {
      // Generate data URL directly
      const dataUrl = await toPng(ref.current, { cacheBust: true });
      console.log("Data URL generated:", dataUrl);

      // Upload image to IPFS
      const image = await fetch(dataUrl).then((res) => res.blob());
      const imgData = new FormData();
      imgData.set("file", image);

      console.log("Uploading to IPFS now");
      const uploadRequestImage = await fetch("/api/files", {
        method: "POST",
        body: imgData,
      });

      const imageURI = await uploadRequestImage.json();
      console.log("Image uploaded to IPFS:", imageURI);

      // Mint certificate with the image URI
      await MintCertificate(imageURI.url);
    } catch (error) {
      console.error("Error during minting process:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!params.id) {
    return null;
  }

  return (
    <div>
      <div className="w-full max-w-4xl mx-auto mt-6 rounded-sm overflow-hidden px-4">
        {/* Certificate display */}
        <div ref={ref} className="w-full h-full relative">
          <Certificate courseId={params.id} />
        </div>

        {/* Mint button or connect button */}
        {!account ? (
          <ConnectButton />
        ) : (
          <button
            onClick={handleMint}
            className="w-full bg-blue-500 text-white p-4 rounded-sm mt-4"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Mint"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CertificatePage;

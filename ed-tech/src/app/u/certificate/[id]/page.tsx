"use client";

import Certificate from "@/components/Certificate";
import React, { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useAccount, useWriteContract } from "wagmi";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

//const contractAddress = "0xf37B6D5733bc58DCF5634e50FBd9992EA42408A3";

const CertificatePage = ({ params }: { params: { id: string } }) => {
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const account = useAccount();
  const { writeContractAsync } = useWriteContract();
  const router = useRouter();

  const [certificateInfo, setCertificateInfo] = useState<{
    user: any;
    course: any;
  }>({
    user: {},
    course: {},
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!params.id) return;
    async function getCertificateInfo() {
      try {
        const res = await axios.get(`/api/certificate/${params.id}`);
        if (res.data.success) {
          setCertificateInfo(res.data.data);
        }
      } catch (error) {
        if (error instanceof Error) setError(error.message);
        else setError("Error getting certificate");
      } finally {
        setLoading(false);
      }
    }
    getCertificateInfo();
  }, [params.id]);

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
      const link = document.createElement("a");
      link.download = "tjp-" + Date.now() + ".png";
      link.href = dataUrl;
      link.click();
      console.log("Data URL generated:", dataUrl);
      // Redirect to a URL after minting
    } catch (error) {
      console.error("Error during minting process:", error);
    } finally {
      router.push("https://edu-chain-bs-2.vercel.app");
      setLoading(false);
    }
  }

  if (!params.id) {
    return null;
  }

  if (Object.keys(certificateInfo.course).length === 0)
    return <LoaderCircle className="w-6 h-6 animate-spin text-secondary" />;

  if (error) {
    return (
      <div className="max-w-xl mx-auto w-full">
        <h1 className="text-red-500">Error: {error}</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full max-w-4xl mx-auto mt-6 rounded-sm overflow-hidden px-4">
        {/* Certificate display */}
        <div ref={ref} className="w-full h-full relative">
          <Certificate certificateInfo={certificateInfo} />
        </div>

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
            "Mint and Download"
          )}
        </button>
      </div>
    </div>
  );
};

interface Certificate {
  tokenId: string;
  imageURI: string;
  tokenURI: string;
  owner: string;
}

export default CertificatePage;

"use client";

import Certificate from "@/components/Certificate";
import React, { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import abi from "@/app/abi";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWatchContractEvent,
} from "wagmi";
import axios from "axios";
import CertificateCard from "@/components/CertificateCard";
import { LoaderCircle } from "lucide-react";

const contractAddress = "0xf37B6D5733bc58DCF5634e50FBd9992EA42408A3";

const CertificatePage = ({ params }: { params: { id: string } }) => {
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const account = useAccount();
  const { writeContractAsync } = useWriteContract();

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
      return tx;
    } catch (error) {
      console.error("Error during minting transaction:", error);
      return "";
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
      const tx = await MintCertificate(imageURI);
    } catch (error) {
      console.error("Error during minting process:", error);
    } finally {
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
        <MyCertificates />
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

const MyCertificates = () => {
  const { address } = useAccount();
  const { data, refetch } = useReadContract({
    abi: abi,
    address: contractAddress,
    functionName: "getOwnedCertificates",
    args: [address],
  });
  useWatchContractEvent({
    address: contractAddress,
    abi: abi,
    eventName: "GameSubmitted",
    onLogs(data) {
      console.log("New game added:", data);
      refetch();
    },
  });
  const certificates = data as Certificate[];
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold">My Certificates</h1>
      {certificates && certificates.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.tokenId}
              tokenURI={certificate.tokenURI}
              tokenId={parseInt(certificate.tokenId)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-6">No certificates</p>
      )}
    </div>
  );
};

export default CertificatePage;

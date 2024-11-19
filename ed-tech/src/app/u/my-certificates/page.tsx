"use client";
import CertificateCard from "@/components/CertificateCard";
import { useReadContract, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import abi from "@/app/abi";

const contractAddress = "0xf37B6D5733bc58DCF5634e50FBd9992EA42408A3";

interface Certificate {
  tokenId: string;
  imageURI: string;
  tokenURI: string;
  owner: string;
}

const MyCertificates = () => {
  const { address } = useAccount(); // Get the connected account address
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Using the `useReadContract` hook to fetch data
  const { data, isLoading, isError } = useReadContract({
    abi: abi,
    address: contractAddress,
    functionName: "getOwnedCertificates",
    args: [address],
  });

  // Update certificates state when data changes
  useEffect(() => {
    if (data) {
      setCertificates(data as Certificate[]);
    }
  }, [data]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold">My Certificates</h1>
      {isLoading ? (
        <p className="mt-6">Loading...</p>
      ) : isError ? (
        <p className="mt-6">Failed to fetch certificates</p>
      ) : certificates.length > 0 ? (
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

export default MyCertificates;

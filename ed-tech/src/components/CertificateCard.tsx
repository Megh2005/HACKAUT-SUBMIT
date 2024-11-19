import Image from "next/image";
import { useRouter } from "next/navigation";

interface CertificateCardProps {
  tokenURI: string;
  tokenId: number;
}

const CertificateCard = ({ tokenURI, tokenId }: CertificateCardProps) => {
  const router = useRouter();
  return (
    <div
      className="card bg-primary/85 shadow-xl overflow-hidden"
      onClick={() =>
        router.push(
          `https://testnets.opensea.io/assets/avalanche-fuji/0xf37b6d5733bc58dcf5634e50fbd9992ea42408a3/${tokenId}`
        )
      }
    >
      <div>
        <Image
          src={tokenURI}
          alt="Certificate"
          width="400"
          height="200"
          className="w-full h-48 object-cover"
          style={{ aspectRatio: "400/200", objectFit: "cover" }}
        />
      </div>
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-white line-clamp-1">
          Certificate {tokenId + 1}
        </h2>
        <p className="text-white/85 line-clamp-1 font-medium">
          Token ID: {tokenId}
        </p>
      </div>
    </div>
  );
};

export default CertificateCard;

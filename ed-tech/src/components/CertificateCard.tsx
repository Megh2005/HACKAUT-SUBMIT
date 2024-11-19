import Image from "next/image";

const CertificateCard = () => {
  return (
    <div className="card bg-primary/85 shadow-xl overflow-hidden">
      <div>
        <Image
          src={"https://www.svgrepo.com/show/508699/landscape-placeholder.svg"}
          alt="Certificate"
          width="400"
          height="200"
          className="w-full h-48 object-cover"
          style={{ aspectRatio: "400/200", objectFit: "cover" }}
        />
      </div>
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-white line-clamp-1">
          Certificate Name
        </h2>
        <p className="text-white/85 line-clamp-1 font-medium">Token ID:</p>
      </div>
    </div>
  );
};

export default CertificateCard;

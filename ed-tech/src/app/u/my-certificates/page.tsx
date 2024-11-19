import CertificateCard from "@/components/CertificateCard";

const MyCertificates = () => {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold">My Certificates</h1>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        <CertificateCard />
        <CertificateCard />
        <CertificateCard />
      </div>
    </div>
  );
};

export default MyCertificates;

import Image from "next/image";
import cfTemplate from "../../public/assets/certificate.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

const Certificate = ({ courseId }: { courseId: string }) => {
  const [certificateInfo, setCertificateInfo] = useState<{
    user: any;
    course: any;
  }>({
    user: {},
    course: {},
  });

  useEffect(() => {
    if (!courseId) return;
    async function getCertificateInfo() {
      try {
        const res = await axios.get(`/api/certificate/${courseId}`);
        if (res.data.success) {
          setCertificateInfo(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getCertificateInfo();
  }, [courseId]);

  if (Object.keys(certificateInfo.course).length === 0)
    return <LoaderCircle className="w-6 h-6 animate-spin text-secondary" />;

  return (
    <>
      <Image
        className="w-full h-full"
        src={cfTemplate}
        alt="Certificate Template"
      />
      <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-black text-2xl font-bold text-center">
          {certificateInfo?.user.firstName} {certificateInfo?.user?.lastName}
        </h1>
        <p className="w-xl absolute text-lg text-black top-[3.20rem] right-60">
          {certificateInfo?.course.title}
        </p>
      </div>
    </>
  );
};

export default Certificate;

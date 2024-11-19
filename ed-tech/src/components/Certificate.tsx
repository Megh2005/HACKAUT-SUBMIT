import Image from "next/image";
import cfTemplate from "../../public/assets/certificate.png";

const Certificate = ({
  certificateInfo,
}: {
  certificateInfo: {
    user: any;
    course: any;
  };
}) => {
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

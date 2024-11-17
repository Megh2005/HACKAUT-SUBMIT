"use client";

import Certificate from "@/components/Certificate";
import React, { useCallback, useRef } from "react";
import { toPng } from "html-to-image";

const CertificatePage = ({ params }: { params: { id: string } }) => {
  const ref = useRef<HTMLDivElement>(null);

  // handle html node to png
  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        console.log("Data url: ", dataUrl);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  if (!params.id) {
    return null;
  }

  return (
    <div>
      <div className="w-full max-w-4xl mx-auto mt-6 rounded-sm overflow-hidden px-4">
        <div ref={ref} className="w-full h-full relative">
          <Certificate courseId={params.id} />
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;

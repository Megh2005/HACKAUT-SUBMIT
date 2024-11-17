import { Summary } from "@/interfaces/summary.interface";
import { parseData } from "@/utils/parseSummaryData";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import DeleteSummaryModel from "./DeleteSummaryModal";

const SummaryCard = ({ summary }: { summary: Summary & { _id: string } }) => {
  const [topic, setTopic] = useState("");
  const [points, setPoints] = useState<string[]>([]);

  useEffect(() => {
    if (!summary) return;
    const { topic, points } = parseData(summary.content);
    setTopic(topic);
    setPoints(points);
  }, [summary]);

  return (
    <div>
      <div className="flex mb-2 justify-end">
        <DeleteSummaryModel summary={summary} />
      </div>
      <div
        onClick={() =>
          (
            document.getElementById(`${summary._id}`)! as HTMLDialogElement
          ).showModal()
        }
        className="cursor-pointer card shadow-md dark:shadow-2xl bg-white/50 dark:bg-neutral/55 text-primary-content max-w-md rounded-md"
      >
        <div className="card-body">
          <h2 className="text-base-content card-title font-bold line-clamp-2">
            {topic}
          </h2>
          <p className="text-base-content/85 line-clamp-2">{points}</p>
        </div>
        <dialog id={`${summary._id}`} className="modal">
          <div className="modal-box max-w-4xl cursor-default">
            <form className="my-2" method="dialog">
              <button>
                <ArrowLeft className="w-6 h-6 text-primary" />
              </button>
            </form>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-base-content">
              {topic && topic}
            </h1>
            {points.length > 0 && (
              <h2 className="text-lg md:text-xl font-semibold mb-2 text-base-content">
                Key Points:
              </h2>
            )}
            <ul className="list-disc list-inside space-y-2">
              {points.map((point, index) => (
                <li
                  key={index}
                  className="text-base md:text-lg text-base-content"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default SummaryCard;

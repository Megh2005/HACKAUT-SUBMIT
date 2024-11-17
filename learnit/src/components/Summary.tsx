import { parseData } from "@/utils/parseSummaryData";

const Summary = ({ data }: { data: string }) => {
  const { topic, points } = parseData(data);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto shadow-md dark:shadow-2xl bg-white/50 dark:bg-neutral/55 rounded-md my-4">
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
          <li key={index} className="text-base md:text-lg text-base-content">
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Summary;

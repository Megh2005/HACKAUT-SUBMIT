import BackButton from "@/components/BackButton";
import QuizMain from "@/components/QuizMain";
import QuizSummaryList from "@/components/QuizSummaryList";

const Quiz = ({ params }: { params: { id: string } }) => {
  return (
    <div className="flex-1 px-4 md:px-6 md:pl-28 py-8 w-full flex flex-col bg-base-200">
      <div className="flex gap-3 items-center">
        <BackButton />
        <h1 className="text-base-content text-xl md:text-2xl font-bold tracking-tight">
          Generate Quiz
        </h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-6">
        <div className="flex-1">
          <div className="card bg-white/50 dark:bg-neutral/55 w-full max-w-lg shadow-xl rounded-md">
            <div className="card-body">
              <h2 className="card-title text-base-content">Select summaries</h2>
              <QuizSummaryList notebookId={params.id} />
            </div>
          </div>
        </div>
        <div className="flex-[2]">
          <QuizMain notebookId={params.id} />
        </div>
      </div>
    </div>
  );
};

export default Quiz;

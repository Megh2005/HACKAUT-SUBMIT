import { Quiz } from "@/interfaces/quiz.interface";
import { deleteQuiz } from "@/queries/quiz.queries";
import { Trash2 } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

const DeleteQuizModal = ({ quiz }: { quiz: Quiz & { _id: string } }) => {
  const queryClient = useQueryClient();
  const quizId = quiz?._id;

  const { mutate, isLoading: isDeleting } = useMutation({
    mutationFn: () => deleteQuiz(quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quizzes"],
      });
      toast.success("Quiz deleted successfully", {
        duration: 3000,
        position: "top-center",
      });
      const modal = document.getElementById(
        `delete_quiz_modal-${quizId}`
      )! as HTMLDialogElement;
      modal.close();
    },
    onError: () => {
      toast.error("Error deleting quiz", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const delete_quiz = () => {
    if (!quizId) return;
    mutate();
  };

  return (
    <div>
      <div
        onClick={() =>
          (
            document.getElementById(
              `delete_quiz_modal-${quizId}`
            )! as HTMLDialogElement
          ).showModal()
        }
        className="cursor-pointer  shadow-md rounded-full px-4 py-2 flex gap-2 justify-center items-center bg-red-500 hover:bg-opacity-80 transform active:scale-95 transition duration-150"
      >
        <p className="text-white text-xs md:text-sm font-medium">Delete</p>
        <Trash2 className="w-4 md:w-5 h-4 md:h-5 text-white" />
      </div>
      <dialog id={`delete_quiz_modal-${quizId}`} className="modal">
        <div className="modal-box">
          <h3 className="text-lg md:text-xl text-base-content font-bold">
            Are you sure you want to delete this quiz?
          </h3>
          <p className="text-base-content py-4">This action cannot be undone</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                const modal = document.getElementById(
                  `delete_quiz_modal-${quizId}`
                )! as HTMLDialogElement;
                modal.close();
              }}
              className="btn btn-neutral"
            >
              Cancel
            </button>
            <button
              disabled={isDeleting}
              onClick={delete_quiz}
              className="btn btn-primary"
            >
              {isDeleting ? (
                <div className="loading loading-spinner loading-sm text-primary"></div>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default DeleteQuizModal;

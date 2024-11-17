import { Summary } from "@/interfaces/summary.interface";
import { deleteSummary } from "@/queries/summary.queries";
import { Trash2 } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

const DeleteSummaryModal = ({
  summary,
}: {
  summary: Summary & { _id: string };
}) => {
  const queryClient = useQueryClient();
  const summaryId = summary?._id;

  const { mutate, isLoading: isDeleting } = useMutation({
    mutationFn: () => deleteSummary(summaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["summaries"],
      });
      toast.success("Summary deleted successfully", {
        duration: 3000,
        position: "top-center",
      });
      const modal = document.getElementById(
        `delete_summary_modal-${summaryId}`
      )! as HTMLDialogElement;
      modal.close();
    },
    onError: () => {
      toast.error("Error deleting Summary", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const delete_summary = () => {
    if (!summaryId) return;
    mutate();
  };

  return (
    <div>
      <div
        onClick={() =>
          (
            document.getElementById(
              `delete_summary_modal-${summaryId}`
            )! as HTMLDialogElement
          ).showModal()
        }
        className="cursor-pointer  shadow-md rounded-full px-4 py-2 flex gap-2 justify-center items-center bg-red-500 hover:bg-opacity-80 transform active:scale-95 transition duration-150"
      >
        <p className="text-white text-xs md:text-sm font-medium">Delete</p>
        <Trash2 className="w-4 md:w-5 h-4 md:h-5 text-white" />
      </div>
      <dialog id={`delete_summary_modal-${summaryId}`} className="modal">
        <div className="modal-box">
          <h3 className="text-lg md:text-xl text-base-content font-bold">
            Are you sure you want to delete this summary?
          </h3>
          <p className="text-base-content py-4">This action cannot be undone</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                const modal = document.getElementById(
                  `delete_summary_modal-${summaryId}`
                )! as HTMLDialogElement;
                modal.close();
              }}
              className="btn btn-neutral"
            >
              Cancel
            </button>
            <button
              disabled={isDeleting}
              onClick={delete_summary}
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

export default DeleteSummaryModal;

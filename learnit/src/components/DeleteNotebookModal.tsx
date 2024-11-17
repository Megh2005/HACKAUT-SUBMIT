import { NotebookData } from "@/interfaces/notebook.interface";
import { deleteNotebook } from "@/queries/notebook.queries";
import { Delete } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

const DeleteNotebookModal = ({ notebook }: { notebook: NotebookData }) => {
  const queryClient = useQueryClient();
  const notebookId = notebook?._id;

  const { mutate, isLoading: isDeleting } = useMutation({
    mutationFn: () => deleteNotebook(notebookId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notebooks"],
      });

      const modal = document.getElementById(
        `delete_notebook_modal-${notebookId}`
      )! as HTMLDialogElement;
      modal.close();
    },
    onError: () => {
      toast.error("Error deleting notebook", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const delete_notebook = () => {
    if (!notebookId) return;
    mutate();
  };

  return (
    <div>
      <div
        onClick={() =>
          (
            document.getElementById(
              `delete_notebook_modal-${notebookId}`
            )! as HTMLDialogElement
          ).showModal()
        }
      >
        <Delete className="w-4 h-4 md:w-6 md:h-6 text-base-content/55 hover:text-red-500 transition duration-150 ease-in-out cursor-pointer" />
      </div>
      <dialog id={`delete_notebook_modal-${notebookId}`} className="modal">
        <div className="modal-box">
          <h3 className="text-lg md:text-xl text-base-content font-bold">
            Are you sure you want to delete {notebook.name}?
          </h3>
          <p className="text-base-content py-4">This action cannot be undone</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                const modal = document.getElementById(
                  `delete_notebook_modal-${notebookId}`
                )! as HTMLDialogElement;
                modal.close();
              }}
              className="btn btn-neutral"
            >
              Cancel
            </button>
            <button
              disabled={isDeleting}
              onClick={delete_notebook}
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

export default DeleteNotebookModal;

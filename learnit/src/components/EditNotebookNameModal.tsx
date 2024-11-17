"use client";
import { NotebookData } from "@/interfaces/notebook.interface";
import { updateNotebook } from "@/queries/notebook.queries";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

const EditNotebookNameModal = ({ notebook }: { notebook: NotebookData }) => {
  const [notebookName, setNotebookName] = useState(notebook?.name);

  const queryClient = useQueryClient();

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: () => updateNotebook(notebook?._id, notebookName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notebookInfo", { notebookId: notebook?._id }],
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: ["notebooks"],
      });

      const modal = document.getElementById(
        `edit_notebook_modal-${notebook?._id}`
      )! as HTMLDialogElement;
      modal.close();
    },
    onError: () => {
      toast.error("Error updating notebook", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const updateNotebookName = () => {
    if (!notebookName.trim()) return;

    mutate();
  };

  useEffect(() => {
    if (!notebook) return;
    setNotebookName(notebook.name);
  }, [notebook]);

  return (
    <div>
      <div
        onClick={() =>
          (
            document.getElementById(
              `edit_notebook_modal-${notebook?._id}`
            )! as HTMLDialogElement
          ).showModal()
        }
      >
        <PencilIcon className="cursor-pointer text-primary w-4 h-4 sm:w-6 sm:h-6" />
      </div>
      <dialog id={`edit_notebook_modal-${notebook?._id}`} className="modal">
        <div className="modal-box">
          <h3 className="text-lg md:text-xl text-base-content font-bold">
            Edit Notebook Name
          </h3>

          <div className="my-6">
            <input
              value={notebookName}
              onChange={(e) => setNotebookName(e.target.value)}
              type="text"
              placeholder="Enter notebook name"
              className="text-sm sm:text-base text-base-content input input-bordered w-full"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                const modal = document.getElementById(
                  `edit_notebook_modal-${notebook?._id}`
                )! as HTMLDialogElement;
                modal.close();
              }}
              className="btn btn-neutral"
            >
              Cancel
            </button>
            <button
              disabled={isUpdating}
              onClick={updateNotebookName}
              className="btn btn-primary"
            >
              {isUpdating ? (
                <div className="loading loading-spinner loading-sm text-primary"></div>
              ) : (
                "Update"
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

export default EditNotebookNameModal;

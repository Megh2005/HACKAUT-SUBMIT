"use client";

import { createNotebook } from "@/queries/notebook.queries";
import { FilePlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

const NewNotebookModal = () => {
  const queryClient = useQueryClient();
  const [notebookName, setNotebookName] = useState<string>("");

  const { mutate, isLoading, data } = useMutation({
    mutationFn: () => createNotebook(notebookName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notebooks"],
      });
      setNotebookName("");
      const modal = document.getElementById(
        "create_notebook_modal"
      )! as HTMLDialogElement;
      modal.close();
    },
    onError: () => {
      toast.error("Error creating notebook", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const handleCreateNotebook = () => {
    if (!notebookName.trim()) return;

    mutate();
  };

  return (
    <div>
      <button
        onClick={() =>
          (
            document.getElementById(
              "create_notebook_modal"
            )! as HTMLDialogElement
          ).showModal()
        }
        className="btn btn-md btn-primary"
      >
        <FilePlus className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm">Create</span>
      </button>
      <dialog id="create_notebook_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg md:text-xl text-base-content font-bold">
            Create a new notebook
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
                  "create_notebook_modal"
                )! as HTMLDialogElement;
                modal.close();
              }}
              className="btn btn-neutral"
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              onClick={handleCreateNotebook}
              className="btn btn-primary"
            >
              {isLoading ? (
                <div className="loading loading-spinner loading-sm text-primary"></div>
              ) : (
                "Create"
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

export default NewNotebookModal;

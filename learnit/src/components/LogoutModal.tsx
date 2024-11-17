import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";

const LogoutModal = () => {
  return (
    <div>
      <div
        onClick={() =>
          (
            document.getElementById(`logout_modal`)! as HTMLDialogElement
          ).showModal()
        }
      >
        <LogOut className="w-6 h-6 text-base-content" />
      </div>
      <dialog id={`logout_modal`} className="modal">
        <div className="modal-box">
          <h3 className="text-start text-lg md:text-xl text-base-content font-bold">
            Are you sure you want to logout?
          </h3>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                const modal = document.getElementById(
                  `logout_modal`
                )! as HTMLDialogElement;
                modal.close();
              }}
              className="btn btn-neutral"
            >
              Cancel
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="btn btn-primary"
            >
              Yes
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

export default LogoutModal;

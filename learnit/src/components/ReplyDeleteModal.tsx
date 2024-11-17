import { Dispatch, SetStateAction } from "react";

const ReplyDeleteModal = ({
  handleDeleteReply,
  isDeleting,
  setDeleteModalVisible,
}: {
  handleDeleteReply: any;
  isDeleting: boolean;
  setDeleteModalVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="absolute z-10 top-0 -left-32 w-32 h-full bg-base-100 flex items-center justify-center animate-popup">
      <div className="w-full bg-base-100 rounded-md flex flex-col overflow-hidden shadow-md border border-base-200">
        <div>
          <button
            disabled={isDeleting}
            onClick={handleDeleteReply}
            className="py-2 px-4 w-full text-start hover:bg-error text-base-content hover:text-error-content"
          >
            {isDeleting ? (
              <div className="loading loading-spinner loading-sm text-primary"></div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
        <div>
          <button
            className="px-4 py-2 w-full text-start hover:bg-neutral text-base-content hover:text-neutral-content"
            onClick={() => setDeleteModalVisible(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyDeleteModal;

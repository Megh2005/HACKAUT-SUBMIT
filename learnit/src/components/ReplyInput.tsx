import { Send } from "lucide-react";

const ReplyInput = ({
  stateValue,
  stateAction,
  isReplyLoading,
  onClickAction,
  size = "md",
  placeholder = "Reply to this discussion",
}: {
  isReplyLoading: boolean;
  stateValue: string;
  stateAction: any;
  onClickAction: () => Promise<void>;
  size?: "sm" | "md";
  placeholder?: string;
}) => {
  return (
    <div className="flex items-center gap-3">
      <input
        autoFocus
        onChange={(e) => stateAction(e.target.value)}
        value={stateValue}
        type="text"
        placeholder={placeholder}
        className={`p-4 text-base-content input input-bordered w-full input-${size}`}
      />
      <button
        disabled={isReplyLoading}
        onClick={onClickAction}
        className="btn-sm md:btn-md btn btn-circle"
      >
        {isReplyLoading ? (
          <div className="loading loading-spinner loading-sm text-primary"></div>
        ) : (
          <Send className="text-base-content w-4 h-4 md:w-5 md:h-5" />
        )}
      </button>
    </div>
  );
};

export default ReplyInput;

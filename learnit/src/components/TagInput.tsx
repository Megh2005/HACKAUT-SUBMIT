import Tag from "@/components/Tag";
import { Dispatch, SetStateAction } from "react";

const TagInput = ({
  inputValue,
  setInputValue,
  tags,
  tagError,
  setTagError,
  setTags,
  deleteTag,
}: {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  tagError: string | undefined;
  setTagError: Dispatch<SetStateAction<string | undefined>>;
  deleteTag: (i: number) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-sm sm:text-base text-base-content/85"
        htmlFor="tags"
      >
        Tags
      </label>
      <input
        value={inputValue || ""}
        id="tags"
        type="text"
        placeholder="You can add upto 3 tags"
        className="text-sm sm:text-base text-base-content input input-bordered w-full"
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            if (tags.length === 3) return;
            if (
              inputValue.trim() &&
              !tags.includes(inputValue.trim().toLowerCase())
            ) {
              setTagError(undefined);
              setTags([...tags, inputValue.trim().toLowerCase()]);
              setInputValue("");
            }
          }
        }}
      />
      {tags.length > 0 && (
        <div className="my-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => {
            return (
              <Tag
                onClickHandler={() => deleteTag(index)}
                key={index}
                value={tag}
              />
            );
          })}
        </div>
      )}

      {tagError && <p className="text-sm text-error font-medium">{tagError}</p>}
    </div>
  );
};

export default TagInput;

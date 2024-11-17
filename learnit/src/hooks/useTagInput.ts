import { useState } from "react";

const useTagInput = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [tagError, setTagError] = useState<string | undefined>(undefined);
  const deleteTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return {
    tags,
    setTags,
    inputValue,
    setInputValue,
    tagError,
    setTagError,
    deleteTag,
  };
};

export default useTagInput;

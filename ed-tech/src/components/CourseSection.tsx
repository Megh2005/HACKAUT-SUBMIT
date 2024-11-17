import { Trash2 } from "lucide-react";
import { UseFormRegister } from "react-hook-form";

interface SectionErrors {
  title?: { message?: string };
  video?: { message?: string };
}

const CourseSection = ({
  index,
  onDelete,
  sectionLength,
  register,
  errors,
}: {
  index: number;
  sectionLength: number;
  onDelete?: () => void;
  register: UseFormRegister<any>;
  errors?: SectionErrors;
}) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={`sections.${index}.video`}>Video</label>
          <input
            {...register(`sections.${index}.video`)}
            className="file-input file-input-bordered w-full"
            id={`sections.${index}.video`}
            type="file"
            accept="video/*"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor={`sections.${index}.title`}>Title</label>
            <input
              {...register(`sections.${index}.title`)}
              id={`sections.${index}.title`}
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter section title"
            />
          </div>
          {index === sectionLength - 1 && index !== 0 && (
            <div className="cursor-pointer" onClick={onDelete}>
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Delete Section</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-error mt-2">
        {errors?.video?.message || errors?.title?.message}
      </p>
    </div>
  );
};

export default CourseSection;

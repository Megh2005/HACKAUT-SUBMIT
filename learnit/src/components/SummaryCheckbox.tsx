"use client";

import { Summary } from "@/interfaces/summary.interface";
import { convertDateTime } from "@/utils/convertDateTime";
import { parseData } from "@/utils/parseSummaryData";
import React from "react";
import { useFormContext } from "react-hook-form";

const SummaryCheckbox = ({
  data,
}: {
  data: Summary & { _id: string; createdAt: Date };
}) => {
  const { topic, points } = parseData(data.content);

  const { register } = useFormContext();

  return (
    <label className="label cursor-pointer flex items-start">
      <div>
        <p className="label-text text-base-content/85 font-medium text-base line-clamp-1">
          {topic}
        </p>
        <span className="text-base-content/70 text-xs">
          {convertDateTime(data.createdAt.toString())}
        </span>
      </div>
      <input
        {...register(`checkbox.${data._id}`)}
        type="checkbox"
        className="checkbox checkbox-primary size-5"
      />
    </label>
  );
};

export default SummaryCheckbox;

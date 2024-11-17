import axios from "axios";

export const getAllSummaries = async ({
  pageParam = 1,
  notebookId = "",
  pageSize = 10,
  filter = "",
}: {
  pageParam: number;
  notebookId: string;
  pageSize: number;
  filter?: string;
}) => {
  const res = await axios.get(
    `/api/summaries/${notebookId}?page=${pageParam}&pageSize=${pageSize}&filter=${filter}`
  );

  return res.data;
};

export const getSummary = async (image: File, notebookId: string) => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
  const formData = new FormData();
  formData.append("mediaPath", image);
  formData.append("notebookId", notebookId);

  const res = await axios.post("/api/summarize", formData);

  return res.data;
};

export const deleteSummary = async (id: string) => {
  const res = await axios.delete(`/api/summaries/delete/${id}`);
  return res.data;
};

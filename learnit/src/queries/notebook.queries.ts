import axios from "axios";

export const createNotebook = async (name: string) => {
  const res = await axios.post("/api/notebook", { name });

  return res.data.data;
};

export const getAllNotebooks = async ({
  pageParam = 1,
  query = "",
}: {
  pageParam: number;
  query: string;
}) => {
  const res = await axios.get(`/api/notebook?page=${pageParam}&q=${query}`);

  return res.data;
};

export const getNotebookInfo = async (notebookId: string) => {
  const res = await axios.get(`/api/notebook/${notebookId}`);

  return res.data;
};

export const updateNotebook = async (notebookId: string, name: string) => {
  const res = await axios.patch(`/api/notebook/${notebookId}`, { name });
  return res.data;
};

export const deleteNotebook = async (notebookId: string) => {
  const res = await axios.delete(`/api/notebook/${notebookId}`);
  return res.data;
};

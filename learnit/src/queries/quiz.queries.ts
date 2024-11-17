import axios from "axios";

export const getAllQuizzes = async ({
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
    `/api/quiz/${notebookId}?page=${pageParam}&pageSize=${pageSize}&filter=${filter}`
  );

  return res.data;
};

export const deleteQuiz = async (id: string) => {
  const res = await axios.delete(`/api/quiz/delete/${id}`);
  return res.data;
};

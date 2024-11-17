import axios from "axios";

export async function getDiscussion(id: string) {
  const res = await axios.get(`/api/discussion/${id}`);

  return res.data.data;
}

export async function getAllDiscussions({
  pageParam = 1,
  filter = "",
}: {
  pageParam: number;
  filter: string;
}) {
  const res = await axios.get(
    `/api/discussion?page=${pageParam}&filter=${filter}`
  );

  return res.data;
}

export async function deleteDiscussion(id: string) {
  const res = await axios.delete(`/api/discussion/${id}`);

  return res.data;
}

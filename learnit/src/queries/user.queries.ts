import axios from "axios";

export async function getCurrentUser() {
  const res = await axios.get("/api/user");
  return res.data;
}

export async function getDiscussionsByCurrentUser({
  pageParam = 1,
  pageSize = 10,
  filter = "",
}: {
  pageParam: number;
  pageSize: number;
  filter?: string;
}) {
  const res = await axios.get(
    `/api/user/discussions?page=${pageParam}&pageSize=${pageSize}&filter=${filter}`
  );
  return res.data;
}

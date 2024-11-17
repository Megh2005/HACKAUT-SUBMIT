import axios from "axios";

export async function getReplies({
  pageParam = 1,
  discussionId,
  replyId,
}: {
  pageParam: number;
  discussionId?: string;
  replyId?: string;
}) {
  const url = discussionId
    ? `/api/reply?discussionId=${discussionId}&page=${pageParam}`
    : `/api/reply?replyId=${replyId}&page=${pageParam}`;

  const response = await axios.get(url);
  return response.data;
}

export async function addReply({
  discussionId,
  replyId,
  content,
}: {
  discussionId?: string;
  replyId?: string;
  content: string;
}) {
  const body = discussionId ? { discussionId, content } : { replyId, content };

  const response = await axios.post("/api/reply", body);
  return response.data.data;
}

export async function deleteReply({ replyId }: { replyId: string }) {
  const response = await axios.delete(`/api/reply/${replyId}`);
  return response.data.data;
}

export async function editReply({
  replyId,
  content,
}: {
  replyId: string;
  content: string;
}) {
  const response = await axios.patch(`/api/reply/${replyId}`, { content });

  return response.data.data;
}

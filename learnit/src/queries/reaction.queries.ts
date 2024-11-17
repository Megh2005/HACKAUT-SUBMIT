import axios from "axios";

export const likeDiscussion = async (id: string) => {
  await axios.patch(`/api/discussion/like/${id}`, null);
};

export const dislikeDiscussion = async (id: string) => {
  await axios.patch(`/api/discussion/dislike/${id}`, null);
};

export const likeReply = async (id: string) => {
  await axios.patch(`/api/reply/like/${id}`, null);
};

export const dislikeReply = async (id: string) => {
  await axios.patch(`/api/reply/dislike/${id}`, null);
};

import axios from "axios";

const url = "http://localhost:5000/posts";

export const fetchPosts = (filterts) => axios.get(url, { params: filterts });
export const createPost = (newPost) => axios.post(url, newPost);
export const likePost = (id) => axios.patch(`${url}/${id}/likePost`);
export const updatePost = (id, updatedPost) =>
  axios.patch(`${url}/${id}`, updatedPost);
export const deletePost = (id) => axios.delete(`${url}/${id}`);

export const fetchPostCities = () => axios.get(`${url}/cities`);
export const fetchPostMaxBalance = () => axios.get(`${url}/max-balance`);
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

export const getBoards = () => api.get('/boards').then(r => r.data);
export const createBoard = (data) => api.post('/boards', data).then(r => r.data);
export const updateBoard = (id, data) => api.patch(`/boards/${id}`, data).then(r => r.data);
export const deleteBoard = (id) => api.delete(`/boards/${id}`);

export const getLinks = (boardId) =>
  api.get('/links', { params: boardId ? { boardId } : {} }).then(r => r.data);
export const createLink = (data) => api.post('/links', data).then(r => r.data);
export const updateLinkBoards = (id, boardIds) =>
  api.patch(`/links/${id}/boards`, { boardIds }).then(r => r.data);
export const deleteLink = (id) => api.delete(`/links/${id}`);

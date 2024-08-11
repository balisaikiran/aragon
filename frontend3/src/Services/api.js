import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, logout the user
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);
export const fetchBoards = () => api.get('/boards').then(response => response.data);
export const createBoard = (board) => api.post('/boards', board).then(response => response.data);
export const fetchTasks = (boardId) => api.get(`/tasks?board_id=${boardId}`).then(response => response.data);
export const createTask = (task) => api.post('/tasks', task).then(response => response.data);
export const updateTask = (task) => api.put(`/tasks/${task.id}`, task).then(response => response.data);
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`).then(response => response.data);
export const login = (credentials) => api.post('/login', credentials).then(response => response.data);
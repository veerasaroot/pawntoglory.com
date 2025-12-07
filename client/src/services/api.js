import axios from 'axios';

const API_URL = '/api';

// Auth
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
};

export const register = async (name, email, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
};

// Dashboard
export const getDashboardStats = async () => {
    const response = await axios.get(`${API_URL}/dashboard/stats`);
    return response.data;
};

// Articles
export const getArticles = async (params = {}) => {
    const response = await axios.get(`${API_URL}/articles`, { params });
    return response.data;
};

export const getArticleBySlug = async (slug) => {
    const response = await axios.get(`${API_URL}/articles/${slug}`);
    return response.data;
};

export const getAdminArticles = async () => {
    const response = await axios.get(`${API_URL}/articles/admin`);
    return response.data;
};

export const createArticle = async (data) => {
    const response = await axios.post(`${API_URL}/articles`, data);
    return response.data;
};

export const updateArticle = async (id, data) => {
    const response = await axios.put(`${API_URL}/articles/${id}`, data);
    return response.data;
};

export const deleteArticle = async (id) => {
    const response = await axios.delete(`${API_URL}/articles/${id}`);
    return response.data;
};

// Categories
export const getCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
};

export const getCategoryBySlug = async (slug) => {
    const response = await axios.get(`${API_URL}/categories/${slug}`);
    return response.data;
};

export const createCategory = async (data) => {
    const response = await axios.post(`${API_URL}/categories`, data);
    return response.data;
};

export const updateCategory = async (id, data) => {
    const response = await axios.put(`${API_URL}/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await axios.delete(`${API_URL}/categories/${id}`);
    return response.data;
};

// Users
export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await axios.put(`${API_URL}/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
};

// Upload
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

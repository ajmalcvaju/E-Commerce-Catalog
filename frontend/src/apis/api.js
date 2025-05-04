import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export const addProduct = async (formData) => {
  const response = await axios.post(
    `${API_BASE_URL}/products`,
    formData
  );
  return response.data;
};

export const fetchProductById = (id) => {
  return axios.get(`${API_BASE_URL}/products/${id}`);
};

export const updateProductById = (id, formData) => {
  return axios.put(`${API_BASE_URL}/products/${id}`, formData);
};

export const fetchAllProducts = () => {
  return axios.get(`${API_BASE_URL}/products`);
};

export const deleteProductById = (id) => {
  return axios.delete(`${API_BASE_URL}/products/${id}`);
};

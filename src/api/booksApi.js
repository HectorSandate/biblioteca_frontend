import axios from 'axios';

// ✅ Cambia esto por tu IP local si pruebas en un dispositivo físico
const API_URL = 'http://192.168.1.4:3000/api/books';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});


export const getBooks = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los libros:', error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el libro:', error);
    throw error;
  }
};

export const addBook = async (book) => {
  try {
    const response = await api.post('/', book);
    return response.data;
  } catch (error) {
    console.error('Error al agregar el libro:', error);
    throw error;
  }
};

export const updateBook = async (id, book) => {
  try {
    const response = await api.put(`/${id}`, book);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el libro:', error);
    throw error;
  }
};

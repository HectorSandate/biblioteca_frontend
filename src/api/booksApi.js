// import axios from 'axios';
// const API_URL = process.env.EXPO_PUBLIC_API_URL;

// const api = axios.create({
//   baseURL: API_URL,
//   timeout: 5000,
// });


// export const getBooks = async () => {
//   try {
//     const response = await api.get('/');
//     return response.data;
//   } catch (error) {
//     console.error('Error al obtener los libros:', error);
//     throw error;
//   }
// };

// export const getBookById = async (id) => {
//   try {
//     const response = await api.get(`/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error al obtener el libro:', error);
//     throw error;
//   }
// };

// export const addBook = async (book) => {
//   try {
//     const response = await api.post('/', book);
//     return response.data;
//   } catch (error) {
//     console.error('Error al agregar el libro:', error);
//     throw error;
//   }
// };

// export const updateBook = async (id, book) => {
//   try {
//     const response = await api.put(`/${id}`, book);
//     return response.data;
//   } catch (error) {
//     console.error('Error al actualizar el libro:', error);
//     throw error;
//   }
// };


import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

export const getBooks = async () => {
  try {
    const response = await api.get('/books');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los libros:', error);
    throw error;
  }
};

export const addBook = async (book) => {
  try {
    const response = await api.post('/books', book);
    return response.data;
  } catch (error) {
    console.error('Error al agregar el libro:', error);
    throw error;
  }
};

export const updateBook = async (id, book) => {
  try {
    const response = await api.put(`/books/${id}`, book);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el libro:', error);
    throw error;
  }
};

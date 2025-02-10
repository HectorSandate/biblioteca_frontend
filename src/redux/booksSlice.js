// src/redux/booksSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  books: [],
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook: (state, action) => {
      state.books.push(action.payload);
    },
    updateBook: (state, action) => {
      const index = state.books.findIndex(book => book.id === action.payload.id);
      if (index !== -1) {
        // ✅ Actualizamos solo las propiedades necesarias
        state.books[index] = {
          ...state.books[index], // Mantener las propiedades existentes
          ...action.payload,     // Sobrescribir con las nuevas propiedades
        };
      }
    },
  },
});

export const { addBook, updateBook } = booksSlice.actions;
export default booksSlice.reducer;

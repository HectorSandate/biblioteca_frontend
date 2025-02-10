import axios from 'axios';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@env'; // ✅ Importar desde el .env

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
export const uploadImageToCloudinary = async (imageUri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg', // Asegúrate de que el tipo de archivo sea correcto
    name: 'book_image.jpg',
  });
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.secure_url;  // ✅ Devuelve la URL de la imagen subida
  } catch (error) {
    console.error('Error al subir la imagen:', error.response?.data || error.message);
    throw error;
  }
};

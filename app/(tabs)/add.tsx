import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Menu, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from '../../src/api/cloudinary';
import { addBook } from '../../src/api/booksApi';
import { useRouter } from 'expo-router';

export default function AddBookScreen() {
  const [name, setName] = useState('');
  const [isbn, setIsbn] = useState('');
  const [status, setStatus] = useState('Disponible');
  const [category, setCategory] = useState('Acción');
  const [imageUri, setImageUri] = useState(null); // ✅ Para la imagen seleccionada

  const router = useRouter();
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  // ✅ Seleccionar imagen desde la galería
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ✅ Guardar libro en la base de datos
  const handleAddBook = async () => {
    try {
      let imageUrl = null;

      if (imageUri) {
        imageUrl = await uploadImageToCloudinary(imageUri); // ✅ Subir imagen a Cloudinary
      }

      await addBook({ name, isbn, status, category, image: imageUrl });
      alert('📚 ¡Libro guardado con éxito!');
      router.push('/');
    } catch (error) {
      console.error('Error al agregar el libro:', error);
      alert('❌ Error al guardar el libro.');
      console.error('Error al subir la imagen:', error.response?.data || error.message);

    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Registrar Nuevo Libro 📚</Text>

      <TextInput
        label="Nombre del libro"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        label="ISBN"
        value={isbn}
        onChangeText={setIsbn}
        style={styles.input}
      />

      <Menu
        visible={statusMenuVisible}
        onDismiss={() => setStatusMenuVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setStatusMenuVisible(true)} style={styles.input}>
            Estado: {status}
          </Button>
        }
      >
        {['Prestado', 'Perdido', 'Disponible'].map((option) => (
          <Menu.Item
            key={option}
            onPress={() => {
              setStatus(option);
              setStatusMenuVisible(false);
            }}
            title={option}
          />
        ))}
      </Menu>

      <Menu
        visible={categoryMenuVisible}
        onDismiss={() => setCategoryMenuVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setCategoryMenuVisible(true)} style={styles.input}>
            Categoría: {category}
          </Button>
        }
      >
        {['Acción', 'Romance', 'Aventura', 'Ciencia Ficción', 'Misterio'].map((option) => (
          <Menu.Item
            key={option}
            onPress={() => {
              setCategory(option);
              setCategoryMenuVisible(false);
            }}
            title={option}
          />
        ))}
      </Menu>

      {/* ✅ Botón para seleccionar una imagen */}
      <Button mode="outlined" onPress={pickImage} style={styles.input}>
        {imageUri ? '📸 Imagen Seleccionada' : 'Seleccionar Imagen'}
      </Button>

      {/* ✅ Vista previa de la imagen seleccionada */}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      )}

      <Button mode="contained" onPress={handleAddBook} style={styles.submitButton}>
        Guardar Libro
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#4A90E2',
  },
});

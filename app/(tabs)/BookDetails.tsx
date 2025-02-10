import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, IconButton, Card, TextInput, Button, Menu } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { updateBook } from '../../src/api/booksApi'; // ✅ Importar la función de la API

const DEFAULT_IMAGE = 'https://m.media-amazon.com/images/I/81y9XvteVOL._UF894,1000_QL80_.jpg';

export default function BookDetailsScreen() {
  const { name, isbn, status, category, image, id } = useLocalSearchParams();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedIsbn, setEditedIsbn] = useState(isbn);
  const [editedStatus, setEditedStatus] = useState(status);
  const [editedCategory, setEditedCategory] = useState(category);

  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  // ✅ Guardar los cambios realizados en la base de datos
  const handleSave = async () => {
    try {
      await updateBook(id, {
        name: editedName,
        isbn: editedIsbn,
        status: editedStatus,
        category: editedCategory,
        image: image || DEFAULT_IMAGE,
      });
      alert('📚 ¡Cambios guardados con éxito!');
      setIsEditing(false);
      router.back(); // ✅ Volver a la pantalla principal para ver los cambios reflejados
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
      alert('❌ Error al guardar los cambios.');
    }
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        size={30}
        onPress={() => router.back()}
        style={styles.backButton}
      />

      <Card style={styles.card}>
        <Image source={{ uri: image || DEFAULT_IMAGE }} style={styles.bookImage} />

        <Card.Content>
          {isEditing ? (
            <>
              {/* Edición del Nombre */}
              <TextInput
                label="Nombre del libro"
                value={editedName}
                onChangeText={setEditedName}
                style={styles.input}
              />

              {/* Edición del ISBN */}
              <TextInput
                label="ISBN"
                value={editedIsbn}
                onChangeText={setEditedIsbn}
                style={styles.input}
              />

              {/* Menú desplegable para el Estatus */}
              <Menu
                visible={statusMenuVisible}
                onDismiss={() => setStatusMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setStatusMenuVisible(true)}
                    style={styles.input}
                  >
                    Estado: {editedStatus}
                  </Button>
                }
              >
                {['Prestado', 'Perdido', 'Disponible'].map((option) => (
                  <Menu.Item
                    key={option}
                    onPress={() => {
                      setEditedStatus(option);
                      setStatusMenuVisible(false);
                    }}
                    title={option}
                  />
                ))}
              </Menu>

              {/* Menú desplegable para la Categoría */}
              <Menu
                visible={categoryMenuVisible}
                onDismiss={() => setCategoryMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setCategoryMenuVisible(true)}
                    style={styles.input}
                  >
                    Categoría: {editedCategory}
                  </Button>
                }
              >
                {['Acción', 'Romance', 'Aventura', 'Ciencia Ficción', 'Misterio'].map((option) => (
                  <Menu.Item
                    key={option}
                    onPress={() => {
                      setEditedCategory(option);
                      setCategoryMenuVisible(false);
                    }}
                    title={option}
                  />
                ))}
              </Menu>

              {/* Botón para guardar cambios */}
              <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                Guardar Cambios
              </Button>
            </>
          ) : (
            <>
              {/* Visualización de datos si no está en modo de edición */}
              <Text style={styles.bookTitle}>{editedName}</Text>
              <Text style={styles.bookInfo}>📚 Categoría: {editedCategory}</Text>
              <Text style={styles.bookInfo}>🔖 ISBN: {editedIsbn}</Text>
              <Text style={styles.bookStatus}>📌 Estado: {editedStatus}</Text>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Botón para alternar entre modo de edición y vista */}
      <IconButton
        icon={isEditing ? 'check-circle' : 'pencil'}
        size={40}
        style={styles.editButton}
        onPress={() => setIsEditing(!isEditing)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  card: {
    borderRadius: 15,
    backgroundColor: '#1E1E1E',
    padding: 16,
  },
  bookImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  bookInfo: {
    fontSize: 16,
    color: '#9BA1A6',
    marginBottom: 6,
  },
  bookStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 10,
  },
  editButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4A90E2',
    borderRadius: 30,
  },
  input: {
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 10,
  },
});

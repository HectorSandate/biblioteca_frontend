import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, IconButton, Card, TextInput, Button, Menu, Dialog, Portal } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { updateBook } from '../../src/api/booksApi'; // ✅ Importar la función de la API
import LottieView from 'lottie-react-native';

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
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const showDialog = (success, message) => {
    setIsSuccess(success);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    if (isSuccess) router.back();
  };

  const handleSave = async () => {
    try {
      await updateBook(id, {
        name: editedName,
        isbn: editedIsbn,
        status: editedStatus,
        category: editedCategory,
        image: image || DEFAULT_IMAGE,
      });
      showDialog(true, '📚 ¡Cambios guardados con éxito!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
      showDialog(false, '❌ Error al guardar los cambios.');
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
              <TextInput
                label="Nombre del libro"
                value={editedName}
                onChangeText={setEditedName}
                style={styles.input}
              />
              <TextInput
                label="ISBN"
                value={editedIsbn}
                onChangeText={setEditedIsbn}
                style={styles.input}
              />

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

              <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                Guardar Cambios
              </Button>
            </>
          ) : (
            <>
              <Text style={styles.bookTitle}>{editedName}</Text>
              <Text style={styles.bookInfo}>📚 Categoría: {editedCategory}</Text>
              <Text style={styles.bookInfo}>🔖 ISBN: {editedIsbn}</Text>
              <Text style={styles.bookStatus}>📌 Estado: {editedStatus}</Text>
            </>
          )}
        </Card.Content>
      </Card>

      <IconButton
        icon={isEditing ? 'check-circle' : 'pencil'}
        size={40}
        style={styles.editButton}
        onPress={() => setIsEditing(!isEditing)}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Content>
            <LottieView
              source={isSuccess ? require('../../assets/animations/succes.json') : require('../../assets/animations/error.json')}
              autoPlay
              loop={false}
              style={{ height: 150 }}
            />
            <Text style={styles.dialogMessage}>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Aceptar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  dialogMessage: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
});

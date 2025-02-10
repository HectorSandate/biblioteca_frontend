import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  TextInput,
  Button,
  Menu,
  Text,
  Dialog,
  Portal,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinary } from "../../src/api/cloudinary";
import { addBook } from "../../src/api/booksApi";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

// Asegúrate de tener una animación JSON en tu carpeta de assets
import successAnimation from "../../assets/animations/succes.json";
import errorAnimation from "../../assets/animations/error.json";

export default function AddBookScreen() {
  const [name, setName] = useState("");
  const [isbn, setIsbn] = useState("");
  const [status, setStatus] = useState("Disponible");
  const [category, setCategory] = useState("Acción");
  const [imageUri, setImageUri] = useState(null);

  const router = useRouter();
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  const showDialog = (message, success = true) => {
    setDialogMessage(message);
    setIsSuccess(success);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    if (isSuccess) {
      router.push("/");
    }
  };

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

  const handleAddBook = async () => {
    try {
      let imageUrl = null;

      if (imageUri) {
        imageUrl = await uploadImageToCloudinary(imageUri);
      }

      await addBook({ name, isbn, status, category, image: imageUrl });

      showDialog("📚 El libro ha sido registrado con éxito.");
    } catch (error) {
      
      showDialog("❌ Error al guardar el libro. Inténtalo de nuevo.", false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Registrar Nuevo Libro 📚
      </Text>

      <TextInput
        label="Nombre del libro"
        value={name}
        onChangeText={setName}
        style={styles.input}
        theme={{ colors: { text: "#000000", placeholder: "#666666" } }}
      />

      <TextInput
        label="ISBN"
        value={isbn}
        onChangeText={setIsbn}
        style={styles.input}
        theme={{ colors: { text: "#000000", placeholder: "#666666" } }}
      />

      <Menu
        visible={statusMenuVisible}
        onDismiss={() => setStatusMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setStatusMenuVisible(true)}
            style={styles.input}
            labelStyle={{ color: "#000000" }}
          >
            Estado: {status}
          </Button>
        }
      >
        {["Prestado", "Perdido", "Disponible"].map((option) => (
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
          <Button
            mode="outlined"
            onPress={() => setCategoryMenuVisible(true)}
            style={styles.input}
            labelStyle={{ color: "#000000" }}
          >
            Categoría: {category}
          </Button>
        }
      >
        {["Acción", "Romance", "Aventura", "Ciencia Ficción", "Misterio"].map(
          (option) => (
            <Menu.Item
              key={option}
              onPress={() => {
                setCategory(option);
                setCategoryMenuVisible(false);
              }}
              title={option}
            />
          )
        )}
      </Menu>

      <Button
        mode="outlined"
        onPress={pickImage}
        style={styles.input}
        labelStyle={{ color: "#000000" }}
      >
        {imageUri ? "📸 Imagen Seleccionada" : "Seleccionar Imagen"}
      </Button>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      )}

      <Button
        mode="contained"
        onPress={handleAddBook}
        style={styles.submitButton}
        labelStyle={{ color: "#FFFFFF" }}
      >
        Guardar Libro
      </Button>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          {/* ✅ Animación Lottie */}
          <View style={styles.animationContainer}>
            <LottieView
              source={isSuccess ? successAnimation : errorAnimation}
              autoPlay
              loop={false}
              style={styles.animation}
            />
          </View>

          <Dialog.Title style={styles.dialogTitle}>
            {isSuccess ? "¡Éxito!" : "Error"}
          </Dialog.Title>

          <Dialog.Content>
            <Text>{dialogMessage}</Text>
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
    padding: 16,
    backgroundColor: "#121212",
  },
  title: {
    marginBottom: 16,
    fontWeight: "bold",
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
  },
  dialogTitle: {
    textAlign: "center",
    fontWeight: "bold",
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  animation: {
    width: 100,
    height: 100,
  },
});

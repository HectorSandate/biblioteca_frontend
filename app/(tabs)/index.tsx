import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { Card, Text, IconButton, Button, TextInput } from 'react-native-paper';
import { Link, useRouter, useFocusEffect } from 'expo-router';
import { getBooks } from '../../src/api/booksApi'; // ✅ Importa la API

const { width } = Dimensions.get('window');
const DEFAULT_IMAGE = 'https://edit.org/images/cat/portadas-libros-big-2019101610.jpg';

export default function HomeScreen() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  // ✅ Cargar los libros al iniciar la app y al regresar a la pantalla principal
  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error('Error al cargar los libros:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBooks(); // ✅ Refresca los datos al volver a la pantalla principal
    }, [])
  );

  // ✅ Filtrado por búsqueda y estado
  const filteredBooks = books.filter(
    (book) =>
      (filterStatus === 'Todos' || book.status === filterStatus) &&
      book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(filteredBooks.map((book) => book.category))];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TextInput
          mode="outlined"
          placeholder="🔍 Buscar libro..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />

        <View style={styles.filterButtonsContainer}>
          {['Todos', 'Prestado', 'Perdido', 'Disponible'].map((status) => (
            <Button
              key={status}
              mode={filterStatus === status ? 'contained' : 'outlined'}
              onPress={() => setFilterStatus(status)}
              style={[
                styles.filterButton,
                filterStatus === status && styles.activeFilterButton,
              ]}
              labelStyle={{ color: filterStatus === status ? '#fff' : '#000' }}
            >
              {status}
            </Button>
          ))}
        </View>

        {filteredBooks.length > 0 && (
          <Card
            style={styles.featuredCard}
            onPress={() =>
              router.push({
                pathname: '/BookDetails',
                params: {
                  id: filteredBooks[0]?.id,
                  name: filteredBooks[0]?.name,
                  isbn: filteredBooks[0]?.isbn,
                  status: filteredBooks[0]?.status,
                  category: filteredBooks[0]?.category,
                  image: filteredBooks[0]?.image,
                },
              })
            }
          >
            <Card.Cover
              source={{ uri: filteredBooks[0]?.image || DEFAULT_IMAGE }}
              style={styles.featuredImage}
            />
            <Card.Content>
              <Text style={styles.featuredTitle}>
                {filteredBooks[0]?.name || 'Libro Destacado'}
              </Text>
            </Card.Content>
          </Card>
        )}

        {categories.map((category) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
            </View>

            <FlatList
              data={filteredBooks.filter((book) => book.category === category)}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Card
                  style={styles.bookCard}
                  onPress={() =>
                    router.push({
                      pathname: '/BookDetails',
                      params: {
                        id: item.id,
                        name: item.name,
                        isbn: item.isbn,
                        status: item.status,
                        category: item.category,
                        image: item.image,
                      },
                    })
                  }
                >
                  <Image
                    source={{ uri: item.image || DEFAULT_IMAGE }}
                    style={styles.bookImage}
                  />
                  <Card.Content>
                    <Text style={styles.bookTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.bookStatus}>{item.status}</Text>
                    <Text style={styles.bookCategory}>
                      Categoría: {item.category}
                    </Text>
                  </Card.Content>
                </Card>
              )}
            />
          </View>
        ))}
      </ScrollView>

      <Link href="/add" asChild>
        <IconButton icon="plus-circle" size={50} style={styles.floatingButton} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  searchBar: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
  },
  activeFilterButton: {
    backgroundColor: '#4A90E2',
  },
  featuredCard: {
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  featuredImage: {
    height: 180,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#fff',
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bookCard: {
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
    width: width * 0.4,
    backgroundColor: '#1E1E1E',
  },
  bookImage: {
    height: 150,
    width: '100%',
  },
  bookTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  bookStatus: {
    color: '#FFD700',
  },
  bookCategory: {
    color: '#9BA1A6',
    fontStyle: 'italic',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4A90E2',
    borderRadius: 30,
  },
});

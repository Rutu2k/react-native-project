import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductsApiService, { Product } from '../services/ProductsApiService';

const ProductListScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductsApiService.getProducts(20, 0);
      setProducts(response.products);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await ProductsApiService.searchProducts(searchQuery);
      setProducts(response.products);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productPrice}>
          ${item.price.toFixed(2)}
          {item.discountPercentage > 0 && (
            <Text style={styles.discount}>
              {' '}
              {item.discountPercentage.toFixed(0)}% off
            </Text>
          )}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>★ {item.rating.toFixed(1)}</Text>
          <Text style={styles.stock}>
            {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5A31F4" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.productList}
          numColumns={2}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products found</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    backgroundColor: '#5A31F4',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productList: {
    padding: 8,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A31F4',
    marginBottom: 6,
  },
  discount: {
    color: '#e53935',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#ff9800',
    fontWeight: 'bold',
  },
  stock: {
    fontSize: 12,
    color: '#888',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#5A31F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});

export default ProductListScreen;

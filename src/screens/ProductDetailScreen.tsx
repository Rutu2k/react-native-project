import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import ProductsApiService, {
  Product,
  ProductReview,
} from '../services/ProductsApiService';

type RouteParams = {
  ProductDetail: {
    productId: number;
  };
};

const { width } = Dimensions.get('window');

const ProductDetailScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'ProductDetail'>>();
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await ProductsApiService.getProductById(productId);
        setProduct(productData);
      } catch (err) {
        setError('Failed to load product details. Please try again.');
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5A31F4" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Product not found'}</Text>
      </View>
    );
  }

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  const renderReviewItem = ({ item }: { item: ProductReview }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>{item.reviewerName}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>
            {Array(Math.floor(item.rating)).fill('★').join('')}
            {Array(5 - Math.floor(item.rating))
              .fill('☆')
              .join('')}
          </Text>
          <Text style={styles.ratingValue}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.reviewDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Product Images */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: product.images[activeImageIndex] || product.thumbnail,
          }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        {product.images.length > 1 && (
          <FlatList
            horizontal
            data={product.images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => setActiveImageIndex(index)}
                style={[
                  styles.thumbnailContainer,
                  activeImageIndex === index && styles.activeThumbnail,
                ]}
              >
                <Image
                  source={{ uri: item }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailList}
          />
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.title}>{product.title}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>
          {product.discountPercentage > 0 && (
            <View style={styles.discountContainer}>
              <Text style={styles.originalPrice}>
                ${product.price.toFixed(2)}
              </Text>
              <Text style={styles.discountBadge}>
                {product.discountPercentage.toFixed(0)}% OFF
              </Text>
            </View>
          )}
        </View>

        <View style={styles.ratingRow}>
          <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
          <Text style={styles.stock}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{product.category}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>SKU</Text>
            <Text style={styles.detailValue}>{product.sku}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Weight</Text>
            <Text style={styles.detailValue}>{product.weight} kg</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dimensions</Text>
            <Text style={styles.detailValue}>
              {product.dimensions.width} × {product.dimensions.height} ×{' '}
              {product.dimensions.depth} cm
            </Text>
          </View>
        </View>

        {/* Shipping & Returns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping & Returns</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Shipping</Text>
            <Text style={styles.detailValue}>
              {product.shippingInformation}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Returns</Text>
            <Text style={styles.detailValue}>{product.returnPolicy}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Warranty</Text>
            <Text style={styles.detailValue}>
              {product.warrantyInformation}
            </Text>
          </View>
        </View>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {product.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>

          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <View key={index} style={styles.reviewItem}>
                {renderReviewItem({ item: review })}
              </View>
            ))
          ) : (
            <Text style={styles.noReviewsText}>No reviews yet</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  errorText: {
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
  },
  imageContainer: {
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  mainImage: {
    width: width,
    height: width,
    backgroundColor: '#f0f0f0',
  },
  thumbnailList: {
    padding: 10,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    marginHorizontal: 5,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeThumbnail: {
    borderColor: '#5A31F4',
    borderWidth: 2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 15,
  },
  brand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5A31F4',
    marginRight: 10,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: '#e53935',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rating: {
    fontSize: 16,
    color: '#ff9800',
    fontWeight: 'bold',
  },
  stock: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '500',
  },
  section: {
    marginVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  reviewItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#ff9800',
    marginRight: 5,
  },
  ratingValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  reviewComment: {
    fontSize: 14,
    color: '#555',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default ProductDetailScreen;

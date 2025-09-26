// Products API Service for DummyJSON
// API documentation: https://dummyjson.com/docs

export type ProductDimensions = {
  width: number;
  height: number;
  depth: number;
};

export type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export type ProductMeta = {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

class ProductsApiService {
  private baseUrl: string = 'https://dummyjson.com';

  /**
   * Get all products with pagination
   * @param limit Maximum number of products to return
   * @param skip Number of products to skip
   * @returns Promise with products data
   */
  async getProducts(limit: number = 10, skip: number = 0): Promise<ProductsResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/products?limit=${limit}&skip=${skip}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get a single product by ID
   * @param id Product ID
   * @returns Promise with product data
   */
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch product with ID ${id}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search products by name/description
   * @param query Search query
   * @returns Promise with matching products
   */
  async searchProducts(query: string): Promise<ProductsResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/products/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error('Failed to search products');
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  /**
   * Get products by category
   * @param category Category name
   * @returns Promise with products in the category
   */
  async getProductsByCategory(category: string): Promise<ProductsResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/products/category/${encodeURIComponent(category)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch products in category ${category}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      throw error;
    }
  }
}

export default new ProductsApiService();

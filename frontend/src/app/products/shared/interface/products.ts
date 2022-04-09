export interface Products {}
export interface ProductCard {
  id: string;
  price: number;
  thumbnail: string;
}
export interface ProductList {
  results: ProductCard[];
  count: number;
}
export interface ProductDetail {
  id: string;
  name: string;
  rating: number;
  rating_count: number;
  price: number;
  old_price: number;
  quantity: number;
  image: string;
  description: string;
  type: number;
}

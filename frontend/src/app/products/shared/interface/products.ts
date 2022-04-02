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

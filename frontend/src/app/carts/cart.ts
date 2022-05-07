export interface Cart {}
export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}
export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  thumbnail: string;
}

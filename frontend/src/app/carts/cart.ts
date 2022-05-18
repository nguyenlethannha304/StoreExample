import { Product } from '../products/shared/interface/products';
import { PositiveInteger } from '../shared/interface/share';

export type Cart = {
  cartItems: CartItem[];
  count: PositiveInteger;
};
export type CartItem = {
  id: string;
  quantity: number;
  product: RelatedProduct;
};
export type RelatedProduct = Pick<
  Product,
  'id' | 'name' | 'quantity' | 'price' | 'thumbnail'
>;

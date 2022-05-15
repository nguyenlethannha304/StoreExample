export interface Orders {
  item_price: number;
  shipping_fee: number;
  total_price: number;
  email: string;
  phone_number: string;
}
export interface OrderItem {
  id: string;
  quantity: number;
}

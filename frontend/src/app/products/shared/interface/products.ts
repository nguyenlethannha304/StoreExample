import {
  FactoryInterface,
  PositiveInteger,
  UUID,
} from 'src/app/shared/interface/share';
export type Category = {
  name: string;
  slug: string;
};
export type Type = {
  id: number;
  name: string;
  slug: string;
  categories: Category[];
};

export type Product = {
  id: UUID;
  name: string;
  slug: string;
  rating: Rating;
  rating_count: PositiveInteger;
  price: PositiveInteger;
  old_price: PositiveInteger;
  quantity: PositiveInteger;
  image: string;
  thumbnail: string;
  description: string;
  type: Pick<Type, 'id'>;
};

type Rating = number;
const Rating: FactoryInterface<Rating> = {
  init(value: Rating) {
    return this.isValid(value) ? value : null;
  },
  isValid(value: Rating) {
    if (!(Number.isInteger(value) && value >= 0 && value <= 5)) {
      return true;
    }
    throw new Error(`Giá trị đánh giá ${value} không hợp lệ`);
  },
};
export type ProductList = {
  results: ProductCard[];
  count: number;
};
export type ProductCard = Pick<Product, 'id' | 'price' | 'thumbnail'>;

export type ProductDetail = Pick<
  Product,
  | 'id'
  | 'name'
  | 'rating'
  | 'rating_count'
  | 'price'
  | 'old_price'
  | 'quantity'
  | 'image'
  | 'description'
  | 'type'
>;

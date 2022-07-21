import {
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
};
export type MenuBar = Category & {
  types: Pick<Type, 'name' | 'slug'>[];
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
  type: Type['id'];
  sub_images: SubImage[];
};
export type SubImage = {
  image:string
}
type Rating = number;
export type ProductCardList = {
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
  | 'sub_images'
>;

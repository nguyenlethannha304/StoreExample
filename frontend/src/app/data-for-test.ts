import { ProductList } from './products/shared/interface/products';
import { Profile } from './users/shared/interface/profile';
// Data for users module
export const provinces = [
  {
    id: 1,
    name: 'Province 1',
    city_set: [
      { id: 1, name: 'City 11', province: 1 },
      { id: 2, name: 'City 12', province: 1 },
    ],
  },
  {
    id: 2,
    name: 'Province 2',
    city_set: [
      { id: 3, name: 'City 21', province: 2 },
      { id: 4, name: 'City 22', province: 2 },
    ],
  },
];
export const profile: Profile = {
  phone: '0979311359',
  street: '123 NTMK',
  province: 2,
  city: null,
};
// Data for products module
export const productList: ProductList = {
  results: [
    {
      id: 'a53c9e26-90ca-4371-beb0-98a41b84518c',
      price: 1711840399,
      thumbnail: null,
    },
    {
      id: '4b010924-e806-42e3-a110-cc44308643d7',
      price: 255349312,
      thumbnail: null,
    },
    {
      id: '855344ba-a458-4514-84cc-c276ba96921d',
      price: 10685559,
      thumbnail: null,
    },
    {
      id: 'a53c9e26-90ca-4371-beb0-98a41b84518c',
      price: 1711840399,
      thumbnail: null,
    },
    {
      id: '4b010924-e806-42e3-a110-cc44308643d7',
      price: 255349312,
      thumbnail: null,
    },
    {
      id: '855344ba-a458-4514-84cc-c276ba96921d',
      price: 10685559,
      thumbnail: null,
    },
    {
      id: 'a53c9e26-90ca-4371-beb0-98a41b84518c',
      price: 1711840399,
      thumbnail: null,
    },
    {
      id: '4b010924-e806-42e3-a110-cc44308643d7',
      price: 255349312,
      thumbnail: null,
    },
  ],
  count: 52,
};
export const productList2: ProductList = {
  results: [
    {
      id: 'a53c9e26-90ca-4371-beb0-98a41b84518c',
      price: 1711840399,
      thumbnail: null,
    },
    {
      id: 'a53c9e26-90ca-4371-beb0-98a41b84518c',
      price: 1711840399,
      thumbnail: null,
    },
    {
      id: 'a53c9e26-90ca-4371-beb0-98a41b84518c',
      price: 1711840399,
      thumbnail: null,
    },
    {
      id: 'a53c9e26-90ca-4371-beb0-98a41b84518c',
      price: 1711840399,
      thumbnail: null,
    },
    {
      id: 'a53c9e26-90ca-4371-beb0-98a41b84518c',
      price: 1711840399,
      thumbnail: null,
    },
    {
      id: 'a53c9e26-90ca-4371-beb0-98a41b84518c',
      price: 1711840399,
      thumbnail: null,
    },
    {
      id: 'a53c9e26-90ca-4371-beb0-98a41b84518c',
      price: 1711840399,
      thumbnail: null,
    },
    {
      id: 'a53c9e26-90ca-4371-beb0-98a41b84518c',
      price: 1711840399,
      thumbnail: null,
    },
  ],
  count: 52,
};

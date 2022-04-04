import { Profile } from './users/shared/interface/profile';

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

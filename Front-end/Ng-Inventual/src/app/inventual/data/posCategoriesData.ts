export interface PosCategoriesInterfaceData {
  selected?: boolean;
  id: number;
  image: string;
  name: string;
  subCategory: string;
}
export const posCategoriesData: PosCategoriesInterfaceData[] = [
  {
    id: 1,
    image: '../../../assets/img/category/accessories.png',
    name: 'Accessories',
    subCategory: 'Gadget',
  },
  {
    id: 2,
    image: '../../../assets/img/category/fashion.png',
    name: 'Fashion',
    subCategory: 'Bag',
  },
  {
    id: 3,
    image: '../../../assets/img/category/food.png',
    name: 'Food',
    subCategory: 'Fruit',
  },
  {
    id: 4,
    image: '../../../assets/img/category/electronics.png',
    name: 'Electronics',
    subCategory: 'Bulb',
  },
];

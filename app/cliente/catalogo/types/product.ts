export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  ageRange: string;
  image: string;
  description: string;
  stock: number;
  rating: number;
  isNew?: boolean;
  isOnSale?: boolean;
}

export interface FilterOptions {
  category: string;
  ageRange: string;
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: string;
}
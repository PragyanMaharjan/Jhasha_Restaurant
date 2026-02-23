export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  profileImage?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export interface FoodItem {
  _id: string;
  name: string;
  description: string;
  category: 'starter' | 'main_course' | 'dessert' | 'beverage' | 'side_dish';
  price: number;
  image: string;
  preparationTime?: number;
  isAvailable: boolean;
  isVegetarian: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot';
  rating?: number;
  totalOrders?: number;
  quantity?: number;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface CartState {
  cart: CartItem[];
  total: number;
  addToCart: (food: FoodItem) => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
}

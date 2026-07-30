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
  twoFactorEnabled?: boolean;
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
  cartItemId?: string;
  productId?: string;
}

export interface CartState {
  cart: CartItem[];
  total: number;
  hydrateCart: () => Promise<void>;
  addToCart: (food: FoodItem) => Promise<void>;
  removeFromCart: (foodId: string) => Promise<void>;
  updateQuantity: (foodId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

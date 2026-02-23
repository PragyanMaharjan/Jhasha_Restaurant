import { useCartStore } from '@/lib/store';
import type { FoodItem, CartState } from '@/lib/types';
import { toast } from 'react-toastify';

/**
 * Custom hook for cart operations
 * Provides methods to add, remove, update cart items
 * @returns {Object} Cart state and operations
 */
export function useCart() {
  const cartStore = useCartStore as unknown as () => CartState;
  const { cart, total, addToCart, removeFromCart, updateQuantity, clearCart } = cartStore();

  /**
   * Add item to cart with success notification
   * @param {FoodItem} food - Food item to add
   */
  const handleAddToCart = (food: FoodItem) => {
    addToCart(food);
    toast.success(`${food.name} added to cart!`);
  };

  /**
   * Remove item from cart with confirmation
   * @param {string} foodId - ID of food item to remove
   * @param {string} foodName - Name of food item (for notification)
   */
  const handleRemoveFromCart = (foodId: string, foodName: string) => {
    removeFromCart(foodId);
    toast.info(`${foodName} removed from cart`);
  };

  /**
   * Update quantity of cart item
   * @param {string} foodId - ID of food item
   * @param {number} quantity - New quantity
   */
  const handleUpdateQuantity = (foodId: string, quantity: number) => {
    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }
    if (quantity > 50) {
      toast.error('Maximum quantity is 50');
      return;
    }
    updateQuantity(foodId, quantity);
  };

  /**
   * Clear cart with confirmation
   * @returns {boolean} True if cart was cleared
   */
  const handleClearCart = (): boolean => {
    if (cart.length === 0) {
      toast.info('Cart is already empty');
      return false;
    }
    
    if (confirm('Are you sure you want to clear the cart?')) {
      clearCart();
      toast.success('Cart cleared');
      return true;
    }
    return false;
  };

  /**
   * Get total number of items in cart
   * @returns {number} Total item count
   */
  const getTotalItems = (): number => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  /**
   * Check if cart is empty
   * @returns {boolean} True if cart is empty
   */
  const isEmpty = (): boolean => {
    return cart.length === 0;
  };

  return {
    cart,
    total,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    getTotalItems,
    isEmpty,
  };
}

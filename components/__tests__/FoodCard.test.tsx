import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FoodCard from '../FoodCard';

const mockFood = {
  _id: '1',
  name: 'Test Food',
  description: 'Delicious test food',
  price: 299,
  image: 'test-image.jpg',
  category: 'main_course',
  rating: 4.5,
  isVegetarian: true,
  spiceLevel: 'medium',
};

describe('FoodCard Component', () => {
  it('renders food information correctly', () => {
    render(<FoodCard food={mockFood} />);
    
    expect(screen.getByText('Test Food')).toBeInTheDocument();
    expect(screen.getByText('Delicious test food')).toBeInTheDocument();
    expect(screen.getByText('Rs.299.00')).toBeInTheDocument();
  });

  it('displays vegetarian badge for vegetarian food', () => {
    render(<FoodCard food={mockFood} />);
    
    expect(screen.getByText('🌿 Veg')).toBeInTheDocument();
  });

  it('does not display vegetarian badge for non-vegetarian food', () => {
    const nonVegFood = { ...mockFood, isVegetarian: false };
    render(<FoodCard food={nonVegFood} />);
    
    expect(screen.queryByText('🌿 Veg')).not.toBeInTheDocument();
  });

  it('displays spice level correctly', () => {
    render(<FoodCard food={mockFood} />);
    
    expect(screen.getByText('🌶️ Medium')).toBeInTheDocument();
  });

  it('displays rating if available', () => {
    render(<FoodCard food={mockFood} />);
    
    expect(screen.getByText('⭐ 4.5')).toBeInTheDocument();
  });

  it('calls onAddToCart when Add to Cart button is clicked', () => {
    const mockOnAddToCart = vi.fn();
    render(<FoodCard food={mockFood} onAddToCart={mockOnAddToCart} />);
    
    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);
    
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockFood);
  });

  it('displays food image with correct attributes', () => {
    render(<FoodCard food={mockFood} />);
    
    const img = screen.getByAltText('Test Food');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src');
  });
});

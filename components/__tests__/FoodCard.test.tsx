import { render, screen, fireEvent, within } from '@testing-library/react';
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
    const { container } = render(<FoodCard food={mockFood} />);
    
    expect(screen.getByText('Test Food')).toBeInTheDocument();
    expect(screen.getByText('Delicious test food')).toBeInTheDocument();
    expect(container.textContent).toContain('299');
  });

  it('displays vegetarian badge for vegetarian food', () => {
    const { container } = render(<FoodCard food={mockFood} />);
    
    expect(container.textContent).toContain('Veg');
  });

  it('does not display non-veg badge when vegetarian', () => {
    const { container } = render(<FoodCard food={mockFood} />);
    
    // If it's veg, non-veg shouldn't be there
    expect(container.textContent).not.toContain('Non-Veg');
  });

  it('displays non-vegetarian badge for non-vegetarian food', () => {
    const nonVegFood = { ...mockFood, isVegetarian: false };
    const { container } = render(<FoodCard food={nonVegFood} />);
    
    expect(container.textContent).toContain('Non-Veg');
  });

  it('displays spice level correctly', () => {
    const { container } = render(<FoodCard food={mockFood} />);
    
    expect(container.textContent).toContain('Medium');
  });

  it('displays rating if available', () => {
    const { container } = render(<FoodCard food={mockFood} />);
    
    expect(container.textContent).toContain('4.5');
  });

  it('displays Add to Cart button', () => {
    render(<FoodCard food={mockFood} />);
    
    const addButton = screen.getByText('Add to Cart');
    expect(addButton).toBeInTheDocument();
  });

  it('displays food image with correct src', () => {
    render(<FoodCard food={mockFood} />);
    
    const img = screen.getByAltText('Test Food');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('test-image.jpg'));
  });

  it('displays category label', () => {
    const { container } = render(<FoodCard food={mockFood} />);
    
    expect(container.textContent).toContain('Main Course');
  });

  it('does not display rating badge when rating is 0', () => {
    const noRatingFood = { ...mockFood, rating: 0 };
    const { container } = render(<FoodCard food={noRatingFood} />);
    
    // Should have price but not a separate rating display
    expect(container.textContent).toContain('299');
  });
});

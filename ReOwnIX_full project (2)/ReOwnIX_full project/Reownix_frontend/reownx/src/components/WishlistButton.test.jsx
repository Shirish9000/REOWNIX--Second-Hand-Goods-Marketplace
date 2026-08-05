import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate, useLocation } from 'react-router-dom';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import toast from 'react-hot-toast';
import WishlistButton from './WishlistButton';
import wishlistApi from '../services/wishlistApi';
import { useAuth } from '../context/AuthContext';

// Mocks
vi.mock('../services/wishlistApi', () => ({
  default: {
    add: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

describe('WishlistButton Component', () => {
  const mockNavigate = vi.fn();
  const mockLocation = { pathname: '/products/123' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useLocation).mockReturnValue(mockLocation);
  });

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <WishlistButton productId="prod-123" {...props} />
      </MemoryRouter>
    );
  };

  test('renders outlined heart icon by default when not in wishlist', () => {
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-1' } });
    renderComponent({ initialInWishlist: false });

    const button = screen.getByRole('button', { name: /wishlist/i });
    expect(button).toBeInTheDocument();
  });

  test('redirects unauthenticated user to login and shows toast error', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null });
    renderComponent();

    const button = screen.getByRole('button', { name: /wishlist/i });
    fireEvent.click(button);

    expect(toast.error).toHaveBeenCalledWith('Please login to continue.');
    expect(mockNavigate).toHaveBeenCalledWith('/login', {
      state: { from: mockLocation },
    });
    expect(wishlistApi.add).not.toHaveBeenCalled();
  });

  test('adds product to wishlist when unselected item is clicked', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-1' } });
    vi.mocked(wishlistApi.add).mockResolvedValueOnce({ success: true });

    renderComponent({ initialInWishlist: false });

    const button = screen.getByRole('button', { name: /wishlist/i });
    fireEvent.click(button);

    expect(wishlistApi.add).toHaveBeenCalledWith('prod-123');

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Added to wishlist');
    });
  });

  test('removes product from wishlist when selected item is clicked', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-1' } });
    vi.mocked(wishlistApi.remove).mockResolvedValueOnce({ success: true });

    renderComponent({ initialInWishlist: true });

    const button = screen.getByRole('button', { name: /wishlist/i });
    fireEvent.click(button);

    expect(wishlistApi.remove).toHaveBeenCalledWith('prod-123');

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Removed from wishlist');
    });
  });

  test('displays error toast when API call fails', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-1' } });
    vi.mocked(wishlistApi.add).mockRejectedValueOnce(new Error('Network Error'));

    renderComponent({ initialInWishlist: false });

    const button = screen.getByRole('button', { name: /wishlist/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update wishlist');
    });
  });
});
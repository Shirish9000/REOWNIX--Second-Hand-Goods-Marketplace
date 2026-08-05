import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfileHeader from './ProfileHeader';

describe('ProfileHeader Component', () => {
  const mockUser = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    profileImage: '/profile.jpg',
    createdAt: '2025-01-15T00:00:00.000Z',
    isPremium: false,
  };

  const mockStats = {
    products: 12,
    auctions: 4,
    wishlist: 8,
  };

  const mockOnEdit = vi.fn();
  const mockOnSell = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <ProfileHeader
        user={mockUser}
        stats={mockStats}
        onEdit={mockOnEdit}
        onSell={mockOnSell}
        {...props}
      />
    );

  it('renders user details and profile picture correctly', () => {
    renderComponent();

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();

    const avatarImg = screen.getByAltText('Jane Doe');
    expect(avatarImg).toHaveAttribute('src', '/profile.jpg');
  });

  it('formats member-since date correctly using user.createdAt', () => {
    renderComponent();

    const expectedDate = new Date('2025-01-15T00:00:00.000Z').toLocaleDateString();
    expect(screen.getByText(`Member since ${expectedDate}`)).toBeInTheDocument();
  });

  it('renders metric chips for listings, auctions, and wishlist', () => {
    renderComponent();

    expect(screen.getByText('Listings: 12')).toBeInTheDocument();
    expect(screen.getByText('Auctions: 4')).toBeInTheDocument();
    expect(screen.getByText('Wishlist: 8')).toBeInTheDocument();
  });

  it('renders default zero values for missing stats', () => {
    renderComponent({ stats: {} });

    expect(screen.getByText('Listings: 0')).toBeInTheDocument();
    expect(screen.getByText('Auctions: 0')).toBeInTheDocument();
    expect(screen.getByText('Wishlist: 0')).toBeInTheDocument();
  });

  it('renders Premium chip when user isPremium is true', () => {
    renderComponent({
      user: { ...mockUser, isPremium: true },
    });

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('does not render Premium chip when user isPremium is false', () => {
    renderComponent();

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('triggers onEdit callback when "Edit Profile" button is clicked', () => {
    renderComponent();

    const editButton = screen.getByRole('button', { name: /edit profile/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('triggers onSell callback when "Sell an Item" button is clicked', () => {
    renderComponent();

    const sellButton = screen.getByRole('button', { name: /sell an item/i });
    fireEvent.click(sellButton);

    expect(mockOnSell).toHaveBeenCalledTimes(1);
  });
});
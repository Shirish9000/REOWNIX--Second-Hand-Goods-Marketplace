import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';

// Mock WishlistButton to isolate tests
vi.mock('./WishlistButton', () => ({
  default: ({ productId }) => <button data-testid="wishlist-btn">Wishlist {productId}</button>,
}));

// Mock framer-motion to bypass animation wrapper overhead during DOM assertions
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('ProductCard Component', () => {
  const sampleProduct = {
    id: 101,
    title: 'Vintage Leather Jacket',
    price: 4999,
    image: '/jacket.jpg',
    condition: 'Like New',
    isAuction: false,
    category: { name: 'Fashion' },
    owner: {
      firstName: 'John',
      lastName: 'Doe',
      profileImage: '/owner.jpg',
    },
    viewCount: 120,
    wishlistCount: 15,
    offerCount: 3,
    createdAt: '2026-02-15T10:00:00Z',
  };

  const renderComponent = (props = {}) =>
    render(
      <MemoryRouter>
        <ProductCard product={sampleProduct} {...props} />
      </MemoryRouter>
    );

  it('renders default product details correctly in marketplace mode', () => {
    renderComponent();

    expect(screen.getByText('Vintage Leather Jacket')).toBeInTheDocument();
    expect(screen.getByText('Fashion')).toBeInTheDocument();
    expect(screen.getByText('₹4,999')).toBeInTheDocument();
    expect(screen.getByText('Like New')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByTestId('wishlist-btn')).toBeInTheDocument();
  });

  it('renders placeholder product details when product prop is undefined', () => {
    render(
      <MemoryRouter>
        <ProductCard product={undefined} />
      </MemoryRouter>
    );

    expect(screen.getByText('Placeholder Product')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('₹0')).toBeInTheDocument();
  });

  it('renders Uncategorized when category is explicitly null', () => {
    render(
      <MemoryRouter>
        <ProductCard product={{ ...sampleProduct, category: null }} />
      </MemoryRouter>
    );

    expect(screen.getByText('Uncategorized')).toBeInTheDocument();
  });

  it('displays Auction chip when isAuction is true', () => {
    renderComponent({
      product: { ...sampleProduct, isAuction: true },
    });

    expect(screen.getByText('Auction')).toBeInTheDocument();
  });

  it('renders list view layout when viewMode="list"', () => {
    const { container } = renderComponent({ viewMode: 'list' });

    const imageElement = screen.getByAltText('Vintage Leather Jacket');
    expect(imageElement).toBeInTheDocument();

    const cardElement = container.querySelector('.MuiCard-root');
    expect(cardElement).toHaveStyle({ flexDirection: 'row' });
  });

  it('renders ownerMode correctly with stats, status badge, and actions slot', () => {
    const actionsSlot = <button data-testid="edit-action">Edit Item</button>;

    renderComponent({
      ownerMode: true,
      statusBadge: 'ACTIVE',
      actionsSlot,
    });

    expect(screen.queryByTestId('wishlist-btn')).not.toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('👁 120')).toBeInTheDocument();
    expect(screen.getByText('❤ 15')).toBeInTheDocument();
    expect(screen.getByText('💬 3')).toBeInTheDocument();
    expect(screen.getByTestId('edit-action')).toBeInTheDocument();
  });

  it('falls back to SVG placeholder image when image fails to load', () => {
    renderComponent();

    const img = screen.getByAltText('Vintage Leather Jacket');
    fireEvent.error(img);

    expect(img.src).toContain('data:image/svg+xml');
  });

  it('renders legacy footerActions when provided in non-owner mode', () => {
    const footerActions = <button data-testid="buy-now-btn">Buy Now</button>;

    renderComponent({ footerActions });

    expect(screen.getByTestId('buy-now-btn')).toBeInTheDocument();
  });
});
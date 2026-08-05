// src/components/AuctionCard.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import AuctionCard from './AuctionCard';

// Mock child components to keep unit tests focused and fast
vi.mock('./AuctionStatusBadge', () => ({
  default: ({ status }) => <span data-testid="status-badge">{status}</span>,
}));

vi.mock('./Countdown', () => ({
  default: ({ endDate }) => <span data-testid="countdown">{endDate}</span>,
}));

describe('AuctionCard Component', () => {
  const renderComponent = (auctionProps) => {
    return render(
      <MemoryRouter>
        <AuctionCard auction={auctionProps} />
      </MemoryRouter>
    );
  };

  test('renders default title and "No Image" placeholder when empty auction provided', () => {
    renderComponent({});

    expect(screen.getByText('Untitled Auction')).toBeInTheDocument();
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  test('constructs image URL correctly with base environment URL for relative path', () => {
    const mockAuction = {
      id: '123',
      productTitle: 'Vintage Watch',
      productThumbnail: '/images/watch.jpg',
      status: 'ACTIVE',
    };

    renderComponent(mockAuction);

    const image = screen.getByRole('img', { name: /vintage watch/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      'http://localhost:8080/images/watch.jpg'
    );
  });

  test('renders ACTIVE/LIVE state with price, bid count, and countdown', () => {
    const activeAuction = {
      id: '456',
      productTitle: 'Gaming Laptop',
      productThumbnail: 'https://example.com/laptop.jpg',
      status: 'ACTIVE',
      currentPrice: 50000,
      bidCount: 5,
      endTime: '2026-12-31T23:59:59Z',
    };

    renderComponent(activeAuction);

    expect(screen.getByText('Current Bid')).toBeInTheDocument();
    expect(screen.getByText('₹50,000')).toBeInTheDocument();
    expect(screen.getByText('5 bids')).toBeInTheDocument();
    expect(screen.getByTestId('countdown')).toHaveTextContent(
      '2026-12-31T23:59:59Z'
    );
  });

  test('renders UPCOMING state with starting price and countdown', () => {
    const upcomingAuction = {
      id: '789',
      productTitle: 'Antiques',
      status: 'UPCOMING',
      startingPrice: 1500,
      startTime: '2026-09-01T10:00:00Z',
    };

    renderComponent(upcomingAuction);

    expect(screen.getByText('Starts in')).toBeInTheDocument();
    expect(screen.getByText('Starting: ₹1,500')).toBeInTheDocument();
    expect(screen.getByTestId('countdown')).toHaveTextContent(
      '2026-09-01T10:00:00Z'
    );
  });

  test('renders ENDED state with winner and winning price when bids exist', () => {
    const endedAuction = {
      id: '101',
      productTitle: 'Rare Stamp',
      status: 'ENDED',
      currentPrice: 12500,
      winnerName: 'Alice',
      bidCount: 3,
    };

    renderComponent(endedAuction);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('₹12,500')).toBeInTheDocument();
    expect(screen.getByText('3 bids')).toBeInTheDocument();
  });

  test('renders ENDED state fallback when no bids were placed', () => {
    const endedNoBidsAuction = {
      id: '102',
      productTitle: 'Unsold Painting',
      status: 'ENDED',
      bidCount: 0,
    };

    renderComponent(endedNoBidsAuction);

    expect(screen.getByText('No bids were placed')).toBeInTheDocument();
  });
});
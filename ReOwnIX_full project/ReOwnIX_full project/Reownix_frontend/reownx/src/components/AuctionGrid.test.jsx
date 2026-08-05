import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuctionGrid from './AuctionGrid';

// Mock the child AuctionCard component to keep the test isolated.
vi.mock('./auction/AuctionCard', () => ({
  default: ({ auction }) => (
    <div data-testid="mock-auction-card">
      {auction.title}
    </div>
  ),
}));

describe('AuctionGrid Component', () => {
  const mockAuctions = [
    { id: 1, title: 'Vintage Rolex' },
    { id: 2, title: 'Antique Vase' },
    { id: 3, title: 'Classic Mustang' },
  ];

  it('renders without crashing when the auctions array is empty', () => {
    render(<AuctionGrid auctions={[]} />);
    
    // Ensure no cards are rendered
    expect(screen.queryByTestId('mock-auction-card')).not.toBeInTheDocument();
  });

  it('renders the correct number of AuctionCard components', () => {
    render(<AuctionGrid auctions={mockAuctions} />);
    
    const cards = screen.getAllByTestId('mock-auction-card');
    expect(cards).toHaveLength(3);
  });

  it('passes the correct auction data down to each AuctionCard', () => {
    render(<AuctionGrid auctions={mockAuctions} />);
    
    // Verify that the title of each mocked auction is present in the document
    expect(screen.getByText('Vintage Rolex')).toBeInTheDocument();
    expect(screen.getByText('Antique Vase')).toBeInTheDocument();
    expect(screen.getByText('Classic Mustang')).toBeInTheDocument();
  });
});
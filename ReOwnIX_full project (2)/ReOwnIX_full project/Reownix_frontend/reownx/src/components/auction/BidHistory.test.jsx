// src/components/BidHistory.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import BidHistory from './BidHistory';

describe('BidHistory Component', () => {
  beforeEach(() => {
    // Mock scrollIntoView since jsdom doesn't support layout rendering
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  test('renders empty state message when bids array is empty', () => {
    render(<BidHistory bids={[]} />);

    expect(screen.getByText('Bid History')).toBeInTheDocument();
    expect(screen.getByText('0 bids')).toBeInTheDocument();
    expect(screen.getByText('No bids yet. Be the first!')).toBeInTheDocument();
  });

  test('renders bids sorted by highest amount first regardless of input order', () => {
    const unsortedBids = [
      { id: '1', bidderName: 'Alice', amount: 1000, bidTime: '2026-08-04T10:00:00Z' },
      { id: '2', bidderName: 'Bob', amount: 3500, bidTime: '2026-08-04T10:05:00Z' },
      { id: '3', bidderName: 'Charlie', amount: 2000, bidTime: '2026-08-04T10:02:00Z' },
    ];

    render(<BidHistory bids={unsortedBids} />);

    expect(screen.getByText('3 bids')).toBeInTheDocument();

    const bidderNames = screen.getAllByText(/Alice|Bob|Charlie/).map((el) => el.textContent);
    expect(bidderNames).toEqual(['Bob', 'Charlie', 'Alice']);

    const bidAmounts = screen.getAllByText(/₹/).map((el) => el.textContent);
    expect(bidAmounts).toEqual(['₹3,500', '₹2,000', '₹1,000']);
  });

  test('handles WebSocket response format (bidderName / name / bidAmount / timestamp fields)', () => {
    const wsBids = [
      { id: 'ws-1', name: 'Dave', bidAmount: 5000, timestamp: '2026-08-04T12:00:00Z' },
    ];

    render(<BidHistory bids={wsBids} />);

    expect(screen.getByText('Dave')).toBeInTheDocument();
    expect(screen.getByText('₹5,000')).toBeInTheDocument();
  });

  test('displays "Winning Bid" badge on top bid when auction is ended', () => {
    const bids = [
      { id: '1', bidderName: 'Winner', amount: 10000, bidTime: '2026-08-04T10:00:00Z' },
      { id: '2', bidderName: 'Runner Up', amount: 8000, bidTime: '2026-08-04T09:55:00Z' },
    ];

    render(<BidHistory bids={bids} isEnded={true} />);

    expect(screen.getByText('Winning Bid')).toBeInTheDocument();
  });

  test('does not display "Winning Bid" badge when auction is still active', () => {
    const bids = [
      { id: '1', bidderName: 'Top Bidder', amount: 10000, bidTime: '2026-08-04T10:00:00Z' },
    ];

    render(<BidHistory bids={bids} isEnded={false} />);

    expect(screen.queryByText('Winning Bid')).not.toBeInTheDocument();
  });

  test('calls scrollIntoView when new bids are received', () => {
    const { rerender } = render(<BidHistory bids={[]} />);

    const scrollSpy = window.HTMLElement.prototype.scrollIntoView;

    rerender(
      <BidHistory
        bids={[{ id: '1', bidderName: 'User', amount: 500, bidTime: '2026-08-04T10:00:00Z' }]}
      />
    );

    expect(scrollSpy).toHaveBeenCalled();
  });
});
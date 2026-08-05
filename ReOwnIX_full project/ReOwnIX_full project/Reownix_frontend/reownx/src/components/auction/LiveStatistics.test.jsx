// src/components/LiveStatistics.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import LiveStatistics from './LiveStatistics';

// Mock the child Countdown component to isolate unit tests
vi.mock('./Countdown', () => ({
  default: ({ endTime, status }) => (
    <span data-testid="countdown-mock">{`Status: ${status}, EndTime: ${endTime}`}</span>
  ),
}));

describe('LiveStatistics Component', () => {
  const mockAuction = {
    id: 'auc-1',
    status: 'ACTIVE',
    endTime: '2026-12-31T23:59:59Z',
  };

  test('returns null when no auction prop is provided', () => {
    const { container } = render(<LiveStatistics auction={null} bids={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders section header and all statistical metric cards', () => {
    render(<LiveStatistics auction={mockAuction} bids={[]} />);

    expect(screen.getByText('Live Statistics')).toBeInTheDocument();
    expect(screen.getByText('Total Bids')).toBeInTheDocument();
    expect(screen.getByText('Participants')).toBeInTheDocument();
    expect(screen.getByText('Highest Bidder')).toBeInTheDocument();
    expect(screen.getByText('Time Remaining')).toBeInTheDocument();
  });

  test('calculates and displays total bid count correctly', () => {
    const bids = [
      { bidderId: 'user-1', bidderName: 'Alice' },
      { bidderId: 'user-2', bidderName: 'Bob' },
      { bidderId: 'user-1', bidderName: 'Alice' },
    ];

    render(<LiveStatistics auction={mockAuction} bids={bids} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('calculates unique participant count accurately based on bidder IDs', () => {
    const bids = [
      { bidderId: 'user-1', bidderName: 'Alice' },
      { bidderId: 'user-2', bidderName: 'Bob' },
      { bidderId: 'user-1', bidderName: 'Alice' }, // Duplicate bidder
      { bidderId: 'user-3', bidderName: 'Charlie' },
    ];

    render(<LiveStatistics auction={mockAuction} bids={bids} />);

    // 4 total bids, but only 3 unique participants (user-1, user-2, user-3)
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('displays "No bids yet" when bids list is empty', () => {
    render(<LiveStatistics auction={mockAuction} bids={[]} />);

    expect(screen.getByText('No bids yet')).toBeInTheDocument();
  });

  test('displays highest bidder name from top bid using bidderName property', () => {
    const bids = [
      { bidderId: 'u-1', bidderName: 'Sarah Conner' },
      { bidderId: 'u-2', bidderName: 'John Doe' },
    ];

    render(<LiveStatistics auction={mockAuction} bids={bids} />);

    expect(screen.getByText('Sarah Conner')).toBeInTheDocument();
  });

  test('displays highest bidder name using nested bidder object (firstName and lastName)', () => {
    const bids = [
      {
        bidderId: 'u-1',
        bidder: { id: 'u-1', firstName: 'Bruce', lastName: 'Wayne' },
      },
    ];

    render(<LiveStatistics auction={mockAuction} bids={bids} />);

    expect(screen.getByText('Bruce Wayne')).toBeInTheDocument();
  });

  test('passes auction endTime and status props down to Countdown component', () => {
    render(<LiveStatistics auction={mockAuction} bids={[]} />);

    const countdownMock = screen.getByTestId('countdown-mock');
    expect(countdownMock).toHaveTextContent(
      'Status: ACTIVE, EndTime: 2026-12-31T23:59:59Z'
    );
  });
});
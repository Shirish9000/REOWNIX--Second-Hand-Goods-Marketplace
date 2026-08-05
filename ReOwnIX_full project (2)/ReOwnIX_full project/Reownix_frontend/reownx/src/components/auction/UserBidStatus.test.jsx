// src/components/UserBidStatus.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import UserBidStatus from './UserBidStatus';

// Mock framer-motion to simplify animation transitions during tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('UserBidStatus Component', () => {
  const currentUserId = 'user-123';

  test('returns null when currentUserId is missing or empty', () => {
    const bids = [{ bidderId: 'user-123', amount: 1000 }];
    const { container } = render(
      <UserBidStatus currentUserId={null} bids={bids} status="ACTIVE" />
    );

    expect(container.firstChild).toBeNull();
  });

  test('returns null when bids array is empty or undefined', () => {
    const { container } = render(
      <UserBidStatus currentUserId={currentUserId} bids={[]} status="ACTIVE" />
    );

    expect(container.firstChild).toBeNull();
  });

  test('returns null when status is ENDED or CANCELLED', () => {
    const bids = [{ bidderId: 'user-123', amount: 1000 }];

    const { container: endedContainer } = render(
      <UserBidStatus currentUserId={currentUserId} bids={bids} status="ENDED" />
    );
    expect(endedContainer.firstChild).toBeNull();

    const { container: cancelledContainer } = render(
      <UserBidStatus currentUserId={currentUserId} bids={bids} status="CANCELLED" />
    );
    expect(cancelledContainer.firstChild).toBeNull();
  });

  test('returns null when current user has not placed any bids in history', () => {
    const bids = [
      { bidderId: 'user-999', amount: 2000 },
      { bidderId: 'user-888', amount: 1500 },
    ];

    const { container } = render(
      <UserBidStatus currentUserId={currentUserId} bids={bids} status="ACTIVE" />
    );

    expect(container.firstChild).toBeNull();
  });

  test('renders "You are currently the highest bidder" when top bid belongs to current user', () => {
    const bids = [
      { bidderId: 'user-123', amount: 3000 },
      { bidderId: 'user-999', amount: 2500 },
    ];

    render(
      <UserBidStatus currentUserId={currentUserId} bids={bids} status="ACTIVE" />
    );

    expect(
      screen.getByText(/You are currently the highest bidder/i)
    ).toBeInTheDocument();
  });

  test('renders "You have been outbid" when top bid belongs to another user but current user has bid', () => {
    const bids = [
      { bidderId: 'user-999', amount: 5000 }, // Top bid by another user
      { bidderId: 'user-123', amount: 4000 }, // User's lower bid
    ];

    render(
      <UserBidStatus currentUserId={currentUserId} bids={bids} status="ACTIVE" />
    );

    expect(screen.getByText(/You have been outbid/i)).toBeInTheDocument();
  });

  test('handles nested bidder object structure correctly for ID matching', () => {
    const bids = [
      { bidder: { id: 'user-123' }, amount: 7000 },
      { bidder: { id: 'user-456' }, amount: 6000 },
    ];

    render(
      <UserBidStatus currentUserId={currentUserId} bids={bids} status="ACTIVE" />
    );

    expect(
      screen.getByText(/You are currently the highest bidder/i)
    ).toBeInTheDocument();
  });

  test('compares IDs properly regardless of string vs number types', () => {
    const numericUserId = 123;
    const bids = [
      { bidderId: '123', amount: 1200 }, // String representation
    ];

    render(
      <UserBidStatus currentUserId={numericUserId} bids={bids} status="ACTIVE" />
    );

    expect(
      screen.getByText(/You are currently the highest bidder/i)
    ).toBeInTheDocument();
  });
});
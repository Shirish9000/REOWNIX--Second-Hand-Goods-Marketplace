// src/components/AuctionStatusBadge.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import AuctionStatusBadge from './AuctionStatusBadge';

describe('AuctionStatusBadge Component', () => {
  test('renders ACTIVE status with live label', () => {
    render(<AuctionStatusBadge status="ACTIVE" />);

    expect(screen.getByText('● LIVE')).toBeInTheDocument();
  });

  test('renders UPCOMING status with upcoming label', () => {
    render(<AuctionStatusBadge status="UPCOMING" />);

    expect(screen.getByText('⏰ UPCOMING')).toBeInTheDocument();
  });

  test('renders PENDING status with upcoming label', () => {
    render(<AuctionStatusBadge status="PENDING" />);

    expect(screen.getByText('⏰ UPCOMING')).toBeInTheDocument();
  });

  test('renders ENDED status with ended label', () => {
    render(<AuctionStatusBadge status="ENDED" />);

    expect(screen.getByText('Auction Ended')).toBeInTheDocument();
  });

  test('renders CANCELLED status with cancelled label', () => {
    render(<AuctionStatusBadge status="CANCELLED" />);

    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  test('falls back to ENDED status config when unknown status is provided', () => {
    render(<AuctionStatusBadge status="UNKNOWN_STATUS" />);

    expect(screen.getByText('Auction Ended')).toBeInTheDocument();
  });

  test('handles missing status prop gracefully', () => {
    render(<AuctionStatusBadge />);

    expect(screen.getByText('Auction Ended')).toBeInTheDocument();
  });

  test('applies small size styling without throwing', () => {
    render(<AuctionStatusBadge status="ACTIVE" size="small" />);

    const badgeText = screen.getByText('● LIVE');
    expect(badgeText).toBeInTheDocument();
  });
});
// src/components/WinnerBanner.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import WinnerBanner from './WinnerBanner';

describe('WinnerBanner Component', () => {
  test('renders winner banner when role is "winner"', () => {
    render(<WinnerBanner role="winner" winningBid={15000} />);

    expect(
      screen.getByText(/Congratulations! You won this auction!/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Winning Bid: ₹15,000/i)).toBeInTheDocument();
  });

  test('renders seller banner when role is "seller"', () => {
    render(
      <WinnerBanner
        role="seller"
        winnerName="John Doe"
        winningBid={25000}
      />
    );

    expect(screen.getByText(/Your auction has completed/i)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/Final Price: ₹25,000/i)).toBeInTheDocument();
  });

  test('renders participant non-winner banner when role is "participant"', () => {
    render(
      <WinnerBanner
        role="participant"
        winnerName="Alice"
        winningBid={8000}
      />
    );

    expect(
      screen.getByText(/You did not win this auction/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText(/Winning Bid: ₹8,000/i)).toBeInTheDocument();
  });

 test('renders default "no bids placed" banner when role is "none"', () => {
    render(<WinnerBanner role="none" isCurrentUser={false} isSeller={false} />);

    expect(screen.getByText(/Auction Ended/i)).toBeInTheDocument();
    expect(
      screen.getByText(/No bids were placed on this auction\./i)
    ).toBeInTheDocument();
  });
  test('supports legacy prop fallback: isCurrentUser=true resolves to winner', () => {
    render(<WinnerBanner isCurrentUser={true} winningBid={5000} />);

    expect(
      screen.getByText(/Congratulations! You won this auction!/i)
    ).toBeInTheDocument();
  });

  test('supports legacy prop fallback: isSeller=true resolves to seller', () => {
    render(<WinnerBanner isSeller={true} winnerName="Bob" winningBid={12000} />);

    expect(screen.getByText(/Your auction has completed/i)).toBeInTheDocument();
  });

  test('supports legacy prop fallback: non-seller non-winner resolves to participant', () => {
    render(
      <WinnerBanner
        isCurrentUser={false}
        isSeller={false}
        winnerName="Charlie"
      />
    );

    expect(
      screen.getByText(/You did not win this auction/i)
    ).toBeInTheDocument();
  });
});
// src/components/BidInput.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import BidInput from './BidInput';

describe('BidInput Component', () => {
  const defaultProps = {
    disabled: false,
    disabledReason: '',
    currentPrice: 1000,
    minIncrement: 100,
    onPlaceBid: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('calculates and displays the correct minimum bid amount', () => {
    render(<BidInput {...defaultProps} />);

    // currentPrice (1000) + minIncrement (100) = 1100
    expect(screen.getByText('Minimum bid: ₹1,100')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min ₹1,100')).toBeInTheDocument();
  });

  test('falls back to default minIncrement of 1 when minIncrement is not provided', () => {
    render(<BidInput currentPrice={500} onPlaceBid={vi.fn()} />);

    expect(screen.getByText('Minimum bid: ₹501')).toBeInTheDocument();
  });

  test('disables "Place Bid" button initially when input is empty', () => {
    render(<BidInput {...defaultProps} />);

    const submitBtn = screen.getByRole('button', { name: /place bid/i });
    expect(submitBtn).toBeDisabled();
  });

  test('disables "Place Bid" button if entered bid is lower than minimum required bid', () => {
    render(<BidInput {...defaultProps} />);

    const input = screen.getByLabelText(/your bid/i);
    const submitBtn = screen.getByRole('button', { name: /place bid/i });

    // Minimum required bid is 1100
    fireEvent.change(input, { target: { value: '1050' } });

    expect(submitBtn).toBeDisabled();
  });

  test('enables "Place Bid" button when entered bid meets or exceeds minimum bid', () => {
    render(<BidInput {...defaultProps} />);

    const input = screen.getByLabelText(/your bid/i);
    const submitBtn = screen.getByRole('button', { name: /place bid/i });

    fireEvent.change(input, { target: { value: '1100' } });

    expect(submitBtn).toBeEnabled();
  });

  test('calls onPlaceBid with numeric value and clears input on valid submission', () => {
    const handlePlaceBid = vi.fn();
    render(<BidInput {...defaultProps} onPlaceBid={handlePlaceBid} />);

    const input = screen.getByLabelText(/your bid/i);
    fireEvent.change(input, { target: { value: '1500' } });

    const submitBtn = screen.getByRole('button', { name: /place bid/i });
    fireEvent.click(submitBtn);

    expect(handlePlaceBid).toHaveBeenCalledTimes(1);
    expect(handlePlaceBid).toHaveBeenCalledWith(1500);
    expect(input).toHaveValue(null); // Cleared state for number input
  });

  test('renders disabled state with reason when disabled prop is true', () => {
    render(
      <BidInput
        {...defaultProps}
        disabled={true}
        disabledReason="You are the highest bidder"
      />
    );

    expect(screen.queryByLabelText(/your bid/i)).not.toBeInTheDocument();
    
    // Check both button text and caption text
    const reasonElements = screen.getAllByText('You are the highest bidder');
    expect(reasonElements.length).toBeGreaterThanOrEqual(1);

    const disabledBtn = screen.getByRole('button');
    expect(disabledBtn).toBeDisabled();
  });

  test('renders default disabled text "Auction Closed" when disabledReason is omitted', () => {
    render(<BidInput {...defaultProps} disabled={true} disabledReason="" />);

    expect(screen.getByText('Auction Closed')).toBeInTheDocument();
  });
});
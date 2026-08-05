import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import StatsCards from './StatsCards';

describe('StatsCards Component', () => {
  const mockStats = {
    products: 12,
    activeListings: 8,
    sold: 4,
    offers: 15,
    auctions: 3,
    wishlist: 27,
  };

  test('renders all metric titles', () => {
    render(<StatsCards stats={mockStats} />);

    const titles = [
      'Products',
      'Active Listings',
      'Sold',
      'Offers',
      'Auctions',
      'Wishlist Saves',
    ];

    titles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test('renders correct values provided by stats prop', () => {
    render(<StatsCards stats={mockStats} />);

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('27')).toBeInTheDocument();
  });

  test('defaults to 0 for missing or undefined properties', () => {
    const partialStats = {
      products: 5,
      sold: 2,
    };

    render(<StatsCards stats={partialStats} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(4);
  });

  test('handles undefined stats prop without crashing', () => {
    render(<StatsCards />);

    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(6);
  });

  test('handles null stats prop without crashing', () => {
    render(<StatsCards stats={null} />);

    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(6);
  });
});
// src/components/AuthShowcase.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import AuthShowcase from './AuthShowcase';

describe('AuthShowcase Component', () => {
  test('renders hero title and subtitle texts', () => {
    render(<AuthShowcase />);

    expect(screen.getByText('Buy. Sell. Find Great Deals')).toBeInTheDocument();
    expect(
      screen.getByText(
        'From used mobiles to furniture, cars to bikes, we make second-hand simple.'
      )
    ).toBeInTheDocument();
  });

  test('renders security chip label', () => {
    render(<AuthShowcase />);

    expect(
      screen.getByText("India's trusted marketplace for pre-owned items")
    ).toBeInTheDocument();
  });

  test('renders feature section titles and descriptions', () => {
    render(<AuthShowcase />);

    // Titles
    expect(screen.getByText('Buy Smart')).toBeInTheDocument();
    expect(screen.getByText('Sell Fast')).toBeInTheDocument();
    expect(screen.getByText('Local & Safe')).toBeInTheDocument();
    expect(screen.getByText('Secure & Reliable')).toBeInTheDocument();

    // Descriptions
    expect(
      screen.getByText('Find quality used items at great prices.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('List in minutes and sell near you.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Connect with verified buyers and sellers.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Safer conversations, smarter transactions.')
    ).toBeInTheDocument();
  });

  test('renders statistics numbers and labels', () => {
    render(<AuthShowcase />);

    // Numbers
    expect(screen.getByText('10L+')).toBeInTheDocument();
    expect(screen.getByText('25L+')).toBeInTheDocument();
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();

    // Labels
    expect(screen.getByText('Happy Buyers')).toBeInTheDocument();
    expect(screen.getByText('Items Listed')).toBeInTheDocument();
    expect(screen.getByText('Cities')).toBeInTheDocument();
    expect(screen.getByText('Free to Use')).toBeInTheDocument();
  });
});
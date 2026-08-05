// src/components/auth/AuthFooter.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import AuthFooter from './AuthFooter';

describe('AuthFooter Component', () => {
  test('renders all trust banner headlines', () => {
    render(<AuthFooter />);

    expect(screen.getByText('Free to Use')).toBeInTheDocument();
    expect(screen.getByText('Chat Safely')).toBeInTheDocument();
    expect(screen.getByText('Safe Transactions')).toBeInTheDocument();
    expect(screen.getByText('Trusted Community')).toBeInTheDocument();
  });

  test('renders all descriptive subtitle texts', () => {
    render(<AuthFooter />);

    expect(screen.getByText('No hidden charges')).toBeInTheDocument();
    expect(
      screen.getByText('Built-in chat for buyers & sellers')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Report & block suspicious users')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Millions of users across India')
    ).toBeInTheDocument();
  });

  test('renders all four feature items inside layout container', () => {
    render(<AuthFooter />);

    const features = [
      'Free to Use',
      'Chat Safely',
      'Safe Transactions',
      'Trusted Community',
    ];

    features.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });
});
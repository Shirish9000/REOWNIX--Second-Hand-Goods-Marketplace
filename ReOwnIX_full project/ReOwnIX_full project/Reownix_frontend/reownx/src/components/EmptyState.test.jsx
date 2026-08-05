import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EmptyState from './EmptyState';

describe('EmptyState Component', () => {
  it('renders default title when no title prop is provided', () => {
    render(<EmptyState />);

    expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent('No data available');
  });

  it('renders custom title when provided', () => {
    render(<EmptyState title="No conversations found" />);

    expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent('No conversations found');
  });

  it('renders description when provided', () => {
    render(<EmptyState description="Try adjusting your filter settings." />);

    expect(screen.getByText('Try adjusting your filter settings.')).toBeInTheDocument();
  });

  it('does not render description paragraph when description prop is omitted', () => {
    const { container } = render(<EmptyState title="Empty List" />);

    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('renders both custom title and description together', () => {
    render(
      <EmptyState
        title="No items in cart"
        description="Add items to your cart to see them here."
      />
    );

    expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent('No items in cart');
    expect(
      screen.getByText('Add items to your cart to see them here.')
    ).toBeInTheDocument();
  });
});
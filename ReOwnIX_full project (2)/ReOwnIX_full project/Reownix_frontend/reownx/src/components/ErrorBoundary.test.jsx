import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

// Helper component that throws an error conditionally
const ProblemChild = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test crash error');
  }
  return <div>Normal Content</div>;
};

describe('ErrorBoundary Component', () => {
  let consoleSpy;

  beforeEach(() => {
    // Suppress React's default error logging in console during expected error tests
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Content')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument();
  });

  it('catches error and renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Error: Test crash error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('logs the caught error to console.error via componentDidCatch', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error',
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    );
  });

  it('resets error state when "Try Again" button is clicked', () => {
    // Component wrapper to allow toggling shouldThrow state dynamically
    const TestContainer = () => {
      const [shouldThrow, setShouldThrow] = React.useState(true);

      return (
        <ErrorBoundary onReset={() => setShouldThrow(false)}>
          <ProblemChild shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );
    };

    render(<TestContainer />);

    // Verify error UI is displayed
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    // Click "Try Again"
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    // Verify error UI clears and normal content renders
    expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument();
    expect(screen.getByText('Normal Content')).toBeInTheDocument();
  });

  it('calls optional onReset prop when "Try Again" button is clicked', () => {
    const handleReset = vi.fn();

    render(
      <ErrorBoundary onReset={handleReset}>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
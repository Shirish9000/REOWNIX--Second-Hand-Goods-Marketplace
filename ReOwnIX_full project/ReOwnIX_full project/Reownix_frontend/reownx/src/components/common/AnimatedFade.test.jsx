// src/components/common/AnimatedFade.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import AnimatedFade from './AnimatedFade';

// Mock framer-motion to simplify DOM rendering during tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('AnimatedFade Component', () => {
  test('renders children content correctly', () => {
    render(
      <AnimatedFade>
        <span>Fade Content</span>
      </AnimatedFade>
    );

    expect(screen.getByText('Fade Content')).toBeInTheDocument();
  });

  test('forwards additional props and styles to the root element', () => {
    render(
      <AnimatedFade data-testid="fade-wrapper" className="custom-fade">
        <div>Inner Child</div>
      </AnimatedFade>
    );

    const container = screen.getByTestId('fade-wrapper');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('custom-fade');
  });
});
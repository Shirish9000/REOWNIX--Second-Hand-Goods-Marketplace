import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loading from './Loading';

describe('Loading Component', () => {
  it('renders the circular progress indicator', () => {
    render(<Loading />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('renders centered within a box container with minimum height', () => {
    const { container } = render(<Loading />);

    const boxElement = container.firstChild;
    expect(boxElement).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    });
  });
});
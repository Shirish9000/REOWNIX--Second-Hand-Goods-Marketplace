// src/components/common/SkeletonBox.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import SkeletonBox from './SkeletonBox';

describe('SkeletonBox Component', () => {
  test('renders with default props', () => {
    const { container } = render(<SkeletonBox />);
    const skeletonElement = container.querySelector('.MuiSkeleton-root');

    expect(skeletonElement).toBeInTheDocument();
    expect(skeletonElement).toHaveClass('MuiSkeleton-rectangular');
    expect(skeletonElement).toHaveClass('MuiSkeleton-wave');
  });

  test('applies custom width, height, variant, and animation props', () => {
    const { container } = render(
      <SkeletonBox
        width={200}
        height={50}
        variant="circular"
        animation="pulse"
      />
    );
    const skeletonElement = container.querySelector('.MuiSkeleton-root');

    expect(skeletonElement).toBeInTheDocument();
    expect(skeletonElement).toHaveClass('MuiSkeleton-circular');
    expect(skeletonElement).toHaveClass('MuiSkeleton-pulse');
  });

  test('forwards extra props to underlying MUI Skeleton element', () => {
    const { container } = render(
      <SkeletonBox data-testid="custom-skeleton" sx={{ borderRadius: 4 }} />
    );
    const skeletonElement = container.querySelector('[data-testid="custom-skeleton"]');

    expect(skeletonElement).toBeInTheDocument();
  });
});
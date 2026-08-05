import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PaginationControls from './PaginationControls';

describe('PaginationControls Component', () => {
  const mockOnPageChange = vi.fn();
  const mockOnPageSizeChange = vi.fn();

  const defaultProps = {
    page: 1,
    totalPages: 5,
    onPageChange: mockOnPageChange,
    pageSize: 10,
    onPageSizeChange: mockOnPageSizeChange,
    pageSizeOptions: [10, 20, 50],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pagination and page size selector correctly', () => {
    render(<PaginationControls {...defaultProps} />);

    // Check page size select label and current value
    expect(screen.getByLabelText(/page size/i)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    // Check page numbers rendered by MUI Pagination
    expect(screen.getByRole('button', { name: 'page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 5' })).toBeInTheDocument();
  });

  it('calls onPageChange when a page number button is clicked', () => {
    render(<PaginationControls {...defaultProps} />);

    const page2Button = screen.getByRole('button', { name: 'Go to page 2' });
    fireEvent.click(page2Button);

    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).toHaveBeenCalledWith(expect.anything(), 2);
  });

  it('calls onPageChange when next page arrow button is clicked', () => {
    render(<PaginationControls {...defaultProps} page={1} />);

    const nextButton = screen.getByRole('button', { name: 'Go to next page' });
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).toHaveBeenCalledWith(expect.anything(), 2);
  });

  it('calls onPageSizeChange when a new page size is selected', () => {
    render(<PaginationControls {...defaultProps} />);

    // Open MUI Select dropdown
    const selectCombobox = screen.getByRole('combobox', { name: /page size/i });
    fireEvent.mouseDown(selectCombobox);

    // Click option 20 from dropdown menu listbox
    const option20 = screen.getByRole('option', { name: '20' });
    fireEvent.click(option20);

    expect(mockOnPageSizeChange).toHaveBeenCalledTimes(1);
  });

  it('renders custom page size options when provided', () => {
    render(
      <PaginationControls
        {...defaultProps}
        pageSize={5}
        pageSizeOptions={[5, 15, 25]}
      />
    );

    // Open dropdown
    const selectCombobox = screen.getByRole('combobox', { name: /page size/i });
    fireEvent.mouseDown(selectCombobox);

    // Verify custom options exist in menu
    expect(screen.getByRole('option', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '15' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '25' })).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(<PaginationControls {...defaultProps} page={1} />);

    const prevButton = screen.getByRole('button', { name: 'Go to previous page' });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<PaginationControls {...defaultProps} page={5} totalPages={5} />);

    const nextButton = screen.getByRole('button', { name: 'Go to next page' });
    expect(nextButton).toBeDisabled();
  });
});
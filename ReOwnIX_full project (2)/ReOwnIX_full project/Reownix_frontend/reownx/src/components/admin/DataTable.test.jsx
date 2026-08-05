// src/components/admin/DataTable.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import DataTable from './DataTable';

// Mock framer-motion to prevent layout animation overhead during testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('DataTable Component', () => {
  const sampleColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'role', headerName: 'Role', width: 150 },
  ];

  const sampleRows = [
    { id: 1, name: 'John Doe', role: 'Admin' },
    { id: 2, name: 'Jane Smith', role: 'Seller' },
  ];

  const defaultProps = {
    columns: sampleColumns,
    rows: sampleRows,
    loading: false,
    error: null,
    page: 0,
    pageSize: 10,
    rowCount: 2,
    onPaginationModelChange: vi.fn(),
    onSortModelChange: vi.fn(),
    onFilterModelChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders error alert when error prop is provided', () => {
    render(<DataTable {...defaultProps} error="Failed to fetch" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data.')).toBeInTheDocument();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  test('renders grid columns and row content correctly', () => {
    render(<DataTable {...defaultProps} />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('renders loading progress indicator when loading is true', () => {
    render(<DataTable {...defaultProps} loading={true} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('triggers onSortModelChange when column header sorting is clicked', () => {
    const handleSortModelChange = vi.fn();
    render(
      <DataTable
        {...defaultProps}
        onSortModelChange={handleSortModelChange}
      />
    );

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);

    expect(handleSortModelChange).toHaveBeenCalled();
  });

  test('triggers onPaginationModelChange when pagination button is clicked', () => {
    const handlePaginationModelChange = vi.fn();
    render(
      <DataTable
        {...defaultProps}
        rowCount={25}
        onPaginationModelChange={handlePaginationModelChange}
      />
    );

    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    expect(handlePaginationModelChange).toHaveBeenCalledWith(
      { page: 1, pageSize: 10 },
      expect.anything()
    );
  });
});
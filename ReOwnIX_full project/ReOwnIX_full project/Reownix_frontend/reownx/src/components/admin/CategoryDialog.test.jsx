// src/components/admin/CategoryDialog.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import toast from 'react-hot-toast';
import CategoryDialog from './CategoryDialog';
import categoryService from '../../services/categoryService';

// Mocks
vi.mock('../../services/categoryService', () => ({
  default: {
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CategoryDialog Component', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    mode: 'create',
    category: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders in create mode with empty fields', () => {
    render(<CategoryDialog {...defaultProps} />);

    expect(screen.getByText(/Add Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument();
  });

  test('renders in edit mode and populates existing category values', () => {
    const existingCategory = { id: 1, name: 'Electronics', description: 'Gadgets' };

    render(
      <CategoryDialog
        {...defaultProps}
        mode="edit"
        category={existingCategory}
      />
    );

    expect(screen.getByText(/Edit Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category Name/i)).toHaveValue('Electronics');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('Gadgets');
    expect(screen.getByRole('button', { name: /Update/i })).toBeInTheDocument();
  });

  test('shows validation error when category name is empty on submit', async () => {
    render(<CategoryDialog {...defaultProps} />);

    const submitBtn = screen.getByRole('button', { name: /Create/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Category name is required/i)).toBeInTheDocument();
    });

    expect(categoryService.createCategory).not.toHaveBeenCalled();
  });

  test('creates category successfully on valid form submission', async () => {
    vi.mocked(categoryService.createCategory).mockResolvedValueOnce({ id: 2 });

    render(<CategoryDialog {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Category Name/i), {
      target: { value: 'Books' },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'All kinds of books' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Create/i }));

    await waitFor(() => {
      expect(categoryService.createCategory).toHaveBeenCalledWith({
        name: 'Books',
        description: 'All kinds of books',
      });
      expect(toast.success).toHaveBeenCalledWith('Category created');
      expect(defaultProps.onClose).toHaveBeenCalledWith(true);
    });
  });

  test('updates category successfully in edit mode', async () => {
    const categoryToEdit = { id: 10, name: 'Old Name', description: 'Old Desc' };
    vi.mocked(categoryService.updateCategory).mockResolvedValueOnce({ success: true });

    render(
      <CategoryDialog
        {...defaultProps}
        mode="edit"
        category={categoryToEdit}
      />
    );

    fireEvent.change(screen.getByLabelText(/Category Name/i), {
      target: { value: 'New Name' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Update/i }));

    await waitFor(() => {
      expect(categoryService.updateCategory).toHaveBeenCalledWith(10, {
        name: 'New Name',
        description: 'Old Desc',
      });
      expect(toast.success).toHaveBeenCalledWith('Category updated');
      expect(defaultProps.onClose).toHaveBeenCalledWith(true);
    });
  });

  test('handles API error on submission gracefully', async () => {
    const errorMessage = 'Category already exists';
    vi.mocked(categoryService.createCategory).mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    render(<CategoryDialog {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Category Name/i), {
      target: { value: 'Duplicate' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Create/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  test('calls onClose with false when cancel button is clicked', () => {
    render(<CategoryDialog {...defaultProps} />);

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(defaultProps.onClose).toHaveBeenCalledWith(false);
  });
});
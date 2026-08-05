import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog Component', () => {
  it('does not render when open is false', () => {
    render(
      <ConfirmDialog 
        open={false} 
        title="Delete Item" 
        description="Are you sure you want to delete this item?" 
      />
    );
    
    // The dialog content should not be in the document
    expect(screen.queryByText('Delete Item')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure you want to delete this item?')).not.toBeInTheDocument();
  });

  it('renders title and description correctly when open is true', () => {
    render(
      <ConfirmDialog 
        open={true} 
        title="Delete Item" 
        description="Are you sure you want to delete this item?" 
      />
    );
    
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });

  it('uses the default title if no title prop is provided', () => {
    render(
      <ConfirmDialog 
        open={true} 
        description="Some generic warning." 
      />
    );
    
    // We use getByRole to specifically target the title (heading)
    // because the submit button also contains the text "Confirm"
    expect(screen.getByRole('heading', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('calls onConfirm when the Confirm button is clicked', () => {
    const mockOnConfirm = vi.fn();
    render(<ConfirmDialog open={true} onConfirm={mockOnConfirm} />);
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the Cancel button is clicked', () => {
    const mockOnCancel = vi.fn();
    render(<ConfirmDialog open={true} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
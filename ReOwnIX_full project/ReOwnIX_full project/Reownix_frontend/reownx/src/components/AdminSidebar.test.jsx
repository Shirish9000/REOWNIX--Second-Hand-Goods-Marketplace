import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import * as Mui from '@mui/material';

// Mock the useMediaQuery hook to control desktop vs mobile rendering
vi.mock('@mui/material', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useMediaQuery: vi.fn(),
  };
});

describe('AdminSidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSidebar = () => {
    return render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );
  };

  it('renders all navigation links successfully', () => {
    // Simulate desktop mode
    Mui.useMediaQuery.mockReturnValue(true); 
    renderSidebar();
    
    // Check that all nav items are rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Auctions')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Reviews')).toBeInTheDocument();
  });

  it('hides the hamburger menu icon on desktop screens', () => {
    // Simulate desktop mode
    Mui.useMediaQuery.mockReturnValue(true); 
    renderSidebar();
    
    // The open drawer button should NOT be present on desktop
    const hamburgerBtn = screen.queryByRole('button', { name: /open drawer/i });
    expect(hamburgerBtn).not.toBeInTheDocument();
  });

  it('shows the hamburger menu icon on mobile screens', () => {
    // Simulate mobile mode
    Mui.useMediaQuery.mockReturnValue(false); 
    renderSidebar();
    
    // The open drawer button SHOULD be present on mobile
    const hamburgerBtn = screen.getByRole('button', { name: /open drawer/i });
    expect(hamburgerBtn).toBeInTheDocument();
  });

  it('toggles the drawer when the hamburger menu is clicked on mobile', () => {
    // Simulate mobile mode
    Mui.useMediaQuery.mockReturnValue(false); 
    renderSidebar();
    
    const hamburgerBtn = screen.getByRole('button', { name: /open drawer/i });
    
    // Click to open the drawer
    fireEvent.click(hamburgerBtn);
    
    // Verify drawer contents are accessible
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
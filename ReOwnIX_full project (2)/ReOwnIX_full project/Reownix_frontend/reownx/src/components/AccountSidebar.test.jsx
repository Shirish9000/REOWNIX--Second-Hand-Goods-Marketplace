import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, useNavigate, useLocation } from 'react-router-dom';
import AccountSidebar from './AccountSidebar';import { useAuth } from '../context/AuthContext';

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

// Mock the AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('AccountSidebar Component', () => {
  const mockNavigate = vi.fn();
  const mockLogout = vi.fn();

  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'ROLE_USER',
    profileImage: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue({ pathname: '/profile/me' });
    useAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <AccountSidebar />
      </MemoryRouter>
    );
  };

  it('renders user information correctly', () => {
    renderComponent();
    
    // Check name and email
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    
    // Check avatar fallback (First letter of first name)
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders base menu items for a regular user', () => {
    renderComponent();
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('My Products')).toBeInTheDocument();
    expect(screen.getByText('Wishlist')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    
    // Ensure Admin Dashboard is NOT present for regular users
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
  });

  it('renders Admin Dashboard link if user is an admin', () => {
    // Override mock to simulate an admin user
    useAuth.mockReturnValue({
      user: { ...mockUser, role: 'ROLE_ADMIN' },
      logout: mockLogout,
    });

    renderComponent();
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('highlights the active route correctly', () => {
    // Set location to /profile/my-products to test active state
    useLocation.mockReturnValue({ pathname: '/profile/my-products' });
    renderComponent();

    const activeItem = screen.getByText('My Products').closest('a');
    const inactiveItem = screen.getByText('Wishlist').closest('a');

    // Check styling logic for active vs inactive items
    expect(activeItem).toHaveStyle({ color: 'rgb(37, 99, 235)' }); // #2563EB
    expect(inactiveItem).toHaveStyle({ color: 'rgb(55, 65, 81)' }); // #374151
  });

  it('calls logout and navigates to home when Logout is clicked', () => {
    renderComponent();

    const logoutButton = screen.getByText('Logout').closest('div[role="button"]');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders default avatar letter "U" if user has no first name and no profile image', () => {
    useAuth.mockReturnValue({
      user: { email: 'anonymous@example.com', role: 'ROLE_USER' },
      logout: mockLogout,
    });

    renderComponent();
    
    expect(screen.getByText('U')).toBeInTheDocument();
  });
});
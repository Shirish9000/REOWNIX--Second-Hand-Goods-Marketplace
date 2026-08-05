import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import AdminRoute from './AdminRoute';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
  // We mock Navigate to render a dummy element so we can easily test if a redirect happened
  Navigate: vi.fn(({ to }) => <div data-testid={`navigate-${to}`} />),
}));

// Mock the AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('AdminRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useLocation.mockReturnValue({ pathname: '/admin/dashboard' });
  });

  it('redirects to /login if there is no authenticated user', () => {
    // Mock no user
    useAuth.mockReturnValue({ user: null });

    render(
      <AdminRoute>
        <div data-testid="protected-content">Secret Admin Area</div>
      </AdminRoute>
    );

    // Assert the protected content is not rendered
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    
    // Assert the Navigate component was rendered pointing to /login
    expect(screen.getByTestId('navigate-/login')).toBeInTheDocument();
    
    // Verify Navigate received the correct props
    expect(Navigate).toHaveBeenCalledWith(
      expect.objectContaining({ 
        to: '/login', 
        replace: true,
        state: { from: { pathname: '/admin/dashboard' } }
      }),
      undefined
    );
  });

  it('redirects to / and shows an error toast if user is not an admin', () => {
    // Mock standard user
    useAuth.mockReturnValue({ user: { role: 'ROLE_USER', email: 'user@test.com' } });

    render(
      <AdminRoute>
        <div data-testid="protected-content">Secret Admin Area</div>
      </AdminRoute>
    );

    // Assert the protected content is not rendered
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

    // Assert the Navigate component was rendered pointing to home "/"
    expect(screen.getByTestId('navigate-/')).toBeInTheDocument();

    // Assert the toast.error was triggered
    expect(toast.error).toHaveBeenCalledWith('Admin access required');
  });

  it('renders children if the user is an admin', () => {
    // Mock admin user
    useAuth.mockReturnValue({ user: { role: 'ROLE_ADMIN', email: 'admin@test.com' } });

    render(
      <AdminRoute>
        <div data-testid="protected-content">Secret Admin Area</div>
      </AdminRoute>
    );

    // Assert the protected content IS rendered
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Secret Admin Area')).toBeInTheDocument();

    // Assert Navigate was NOT called
    expect(screen.queryByTestId('navigate-/login')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigate-/')).not.toBeInTheDocument();
    expect(toast.error).not.toHaveBeenCalled();
  });
});
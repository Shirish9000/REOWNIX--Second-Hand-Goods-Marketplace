import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Mock AuthContext hook
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock Loading component
vi.mock('./Loading', () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
  },
}));

// Helper component to verify redirect state and target route
const LocationDisplay = () => {
  const location = useLocation();
  return (
    <div>
      <span data-testid="location-path">{location.pathname}</span>
      <span data-testid="location-state-from">
        {location.state?.from?.pathname || 'none'}
      </span>
    </div>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderProtected = ({
    authValue = { user: null, loading: false },
    initialEntries = ['/dashboard'],
    children = null,
    redirectTo = '/login',
  } = {}) => {
    useAuth.mockReturnValue(authValue);

    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/login" element={<LocationDisplay />} />
          <Route path="/custom-login" element={<LocationDisplay />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute redirectTo={redirectTo}>
                {children}
              </ProtectedRoute>
            }
          >
            {/* Nested route to verify Outlet fallback */}
            <Route path="" element={<div data-testid="outlet-content">Outlet Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders loading spinner when auth status is loading', () => {
    renderProtected({ authValue: { user: null, loading: true } });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('outlet-content')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated user to /login and shows toast error', () => {
    renderProtected({
      authValue: { user: null, loading: false },
      initialEntries: ['/dashboard'],
    });

    expect(screen.getByTestId('location-path')).toHaveTextContent('/login');
    expect(screen.getByTestId('location-state-from')).toHaveTextContent('/dashboard');
    expect(toast.error).toHaveBeenCalledWith('Please login to continue.');
  });

  it('redirects unauthenticated user to custom redirectTo path', () => {
    renderProtected({
      authValue: { user: null, loading: false },
      redirectTo: '/custom-login',
    });

    expect(screen.getByTestId('location-path')).toHaveTextContent('/custom-login');
  });

  it('renders passed children when user is authenticated', () => {
    const mockUser = { id: 1, name: 'Alice' };

    renderProtected({
      authValue: { user: mockUser, loading: false },
      children: <div data-testid="protected-content">Protected Content</div>,
    });

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('renders Outlet when user is authenticated and no children are passed', () => {
    const mockUser = { id: 1, name: 'Alice' };

    renderProtected({
      authValue: { user: mockUser, loading: false },
      children: null,
    });

    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
    expect(toast.error).not.toHaveBeenCalled();
  });
});
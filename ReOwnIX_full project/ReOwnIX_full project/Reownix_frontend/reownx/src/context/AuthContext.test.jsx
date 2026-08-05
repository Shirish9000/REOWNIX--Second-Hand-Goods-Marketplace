// src/context/AuthContext.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import toast from 'react-hot-toast';
import { AuthProvider, useAuth } from './AuthContext';
import authApi from '../services/authApi';
import userApi from '../services/userApi';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock services
vi.mock('../services/authApi', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

vi.mock('../services/userApi', () => ({
  default: {
    getProfile: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const TestComponent = () => {
  const { user, loading, login, register, logout, updateUser } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="user-info">{user ? JSON.stringify(user) : 'No User'}</div>
      <button
        onClick={() => login({ email: 'test@example.com', password: 'password' }).catch(() => {})}
      >
        Login
      </button>
      <button
        onClick={() =>
          register({
            email: 'new@example.com',
            password: 'password',
            firstName: 'John',
          }).catch(() => {})
        }
      >
        Register
      </button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => updateUser({ firstName: 'Updated' })}>
        Update User
      </button>
    </div>
  );
};

const createMockJwt = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${encodedPayload}.signature`;
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(userApi.getProfile).mockResolvedValue({ id: 'user-1', firstName: 'ProfileUser' });
  });

  test('initializes with no user when no token is saved', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
  });

  test('loads and decodes user from saved token on mount', async () => {
    const mockToken = createMockJwt({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
    });
    localStorage.setItem('authToken', mockToken);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).not.toHaveTextContent('No User');
    });
  });

  test('logs in user successfully and stores token', async () => {
    const mockLoginResponse = {
      data: {
        token: 'mock-jwt-token',
        userId: '123',
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'bob@example.com',
        role: 'USER',
      },
    };
    vi.mocked(authApi.login).mockResolvedValueOnce(mockLoginResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'mock-jwt-token');
      expect(toast.success).toHaveBeenCalledWith('Logged in successfully');
      expect(screen.getByTestId('user-info')).toHaveTextContent('Bob');
    });
  });

  test('handles login failure gracefully', async () => {
    vi.mocked(authApi.login).mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  test('registers new user successfully', async () => {
    const mockRegisterResponse = {
      data: {
        token: 'new-mock-token',
        userId: '456',
        firstName: 'John',
        lastName: 'Doe',
        email: 'new@example.com',
        role: 'USER',
      },
    };
    vi.mocked(authApi.register).mockResolvedValueOnce(mockRegisterResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'new-mock-token');
      expect(toast.success).toHaveBeenCalledWith('Account created');
      expect(screen.getByTestId('user-info')).toHaveTextContent('John');
    });
  });

  test('logs out user and removes token', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
  });

  test('updates user state when updateUser is called', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /update user/i }));

    expect(screen.getByTestId('user-info')).toHaveTextContent('Updated');
  });

  test('clears session when auth-unauthorized event is dispatched', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    act(() => {
      window.dispatchEvent(new Event('auth-unauthorized'));
    });

    expect(toast.error).toHaveBeenCalledWith('Session expired. Please login again.');
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
  });
});
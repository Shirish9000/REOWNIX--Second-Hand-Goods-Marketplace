import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../context/ThemeContext';
import wishlistApi from '../services/wishlistApi';
import chatService from '../services/chatService';

// Mock AuthContext hook
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock ThemeContext hook
vi.mock('../context/ThemeContext', () => ({
  useColorMode: vi.fn(),
}));

// Mock Wishlist API
vi.mock('../services/wishlistApi', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock Chat Service
vi.mock('../services/chatService', () => ({
  default: {
    listConversations: vi.fn(),
  },
}));

// Mock PremiumSearchBar component to isolate Navbar tests
vi.mock('./home/PremiumSearchBar', () => ({
  default: () => <div data-testid="premium-search-bar">Search Bar Mock</div>,
}));

describe('Navbar Component', () => {
  const mockToggleColorMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useColorMode.mockReturnValue({ mode: 'light', toggleColorMode: mockToggleColorMode });
    useAuth.mockReturnValue({ user: null });
    wishlistApi.get.mockResolvedValue([]);
    chatService.listConversations.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderNavbar = (initialEntries = ['/']) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Navbar />
      </MemoryRouter>
    );

  it('renders branding logo and main navigation elements', () => {
    renderNavbar();

    expect(screen.getByText('ReOwnIX')).toBeInTheDocument();
    expect(screen.getByText('Live Auctions')).toBeInTheDocument();
    expect(screen.getByTestId('premium-search-bar')).toBeInTheDocument();
  });

  it('renders unauthenticated state with Log in and Sign up buttons', () => {
    useAuth.mockReturnValue({ user: null });
    renderNavbar();

    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /premium/i })).toBeInTheDocument();
  });

  it('renders authenticated state with user profile avatar and actions', async () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      role: 'ROLE_USER',
    };
    useAuth.mockReturnValue({ user: mockUser });
    wishlistApi.get.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    chatService.listConversations.mockResolvedValue([{ unreadCount: 3 }]);

    renderNavbar();

    // Check user avatar fallback letter
    expect(screen.getByText('J')).toBeInTheDocument();

    // Check wishlist badge count
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    // Check unread chat badge count
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    // Check sell button
    expect(screen.getByRole('link', { name: /sell/i })).toBeInTheDocument();
  });

  it('renders Admin Dashboard button when user has ROLE_ADMIN', () => {
    useAuth.mockReturnValue({
      user: { firstName: 'Admin', role: 'ROLE_ADMIN' },
    });

    renderNavbar();

    expect(screen.getByRole('link', { name: /admin dashboard/i })).toBeInTheDocument();
  });

  it('renders simplified navbar layout when on login or register pages', () => {
    useAuth.mockReturnValue({ user: null });
    renderNavbar(['/login']);

    expect(screen.getByText('Back to Home')).toBeInTheDocument();
    expect(screen.queryByTestId('premium-search-bar')).not.toBeInTheDocument();
    expect(screen.queryByText('Live Auctions')).not.toBeInTheDocument();
  });

  it('triggers theme toggle when dark mode button is clicked', () => {
    renderNavbar();

    const themeToggleBtn = screen.getAllByRole('button')[0];
    fireEvent.click(themeToggleBtn);

    expect(mockToggleColorMode).toHaveBeenCalledTimes(1);
  });

  it('polls chat unread count on mount for authenticated user', async () => {
    useAuth.mockReturnValue({ user: { firstName: 'Jane' } });
    chatService.listConversations.mockResolvedValue([{ unreadCount: 5 }]);

    renderNavbar();

    await waitFor(() => {
      expect(chatService.listConversations).toHaveBeenCalled();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('refetches chat unread count when reownx-new-chat-message custom event fires', async () => {
    useAuth.mockReturnValue({ user: { firstName: 'Jane' } });
    chatService.listConversations.mockResolvedValue([{ unreadCount: 1 }]);

    renderNavbar();

    await waitFor(() => {
      expect(chatService.listConversations).toHaveBeenCalledTimes(1);
    });

    // Dispatch real-time chat event
    fireEvent(window, new CustomEvent('reownx-new-chat-message'));

    await waitFor(() => {
      expect(chatService.listConversations).toHaveBeenCalledTimes(2);
    });
  });
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import ConversationList from './ConversationList';
import chatApi from '../services/chatApi';

// Mock the API module
vi.mock('../services/chatApi', () => ({
  default: {
    list: vi.fn(),
  },
}));

// Helper to render with Router wrapper (required by Link component)
const renderComponent = () =>
  render(
    <MemoryRouter>
      <ConversationList />
    </MemoryRouter>
  );

// Mock conversation fixtures
const mockConversations = [
  {
    id: 'conv-1',
    product: { name: 'Vintage Camera', image: '/camera.jpg' },
    otherUser: { name: 'Alice Smith' },
    lastMessage: {
      content: 'Is this still available?',
      createdAt: new Date().toISOString(),
    },
    lastMessageType: 'TEXT',
    unreadCount: 2,
    latestOfferStatus: null,
  },
  {
    id: 'conv-2',
    product: { name: 'Leather Jacket', image: '/jacket.jpg' },
    otherUser: { name: 'Bob Jones' },
    lastMessage: {
      content: '$50',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    lastMessageType: 'OFFER',
    unreadCount: 0,
    latestOfferStatus: 'PENDING',
  },
];

describe('ConversationList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading indicator initially', () => {
    chatApi.list.mockReturnValue(new Promise(() => {}));
    renderComponent();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders list of conversations correctly after loading', async () => {
    chatApi.list.mockResolvedValue(mockConversations);
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Vintage Camera')).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Is this still available?')).toBeInTheDocument();

    expect(screen.getByText('Leather Jacket')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.getByText('Offer: $50')).toBeInTheDocument();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('renders empty state when no conversations exist', async () => {
    chatApi.list.mockResolvedValue([]);
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Start by making an offer or sending a message.')
      ).toBeInTheDocument();
    });
  });

  it('filters conversations correctly based on search input', async () => {
    chatApi.list.mockResolvedValue(mockConversations);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Vintage Camera')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search conversations…');

    // Search by product name
    fireEvent.change(searchInput, { target: { value: 'Jacket' } });
    expect(screen.queryByText('Vintage Camera')).not.toBeInTheDocument();
    expect(screen.getByText('Leather Jacket')).toBeInTheDocument();

    // Search by user name
    fireEvent.change(searchInput, { target: { value: 'Alice' } });
    expect(screen.getByText('Vintage Camera')).toBeInTheDocument();
    expect(screen.queryByText('Leather Jacket')).not.toBeInTheDocument();

    // Search with no matching results
    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });
    expect(
      screen.getByText('Start by making an offer or sending a message.')
    ).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    chatApi.list.mockRejectedValue(new Error('Network error'));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Start by making an offer or sending a message.')
      ).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch conversations',
      expect.any(Error)
    );
  });

  it('refetches conversations when reownx-new-chat-message event is dispatched', async () => {
    chatApi.list.mockResolvedValue(mockConversations);
    renderComponent();

    await waitFor(() => {
      expect(chatApi.list).toHaveBeenCalledTimes(1);
    });

    fireEvent(window, new CustomEvent('reownx-new-chat-message'));

    await waitFor(() => {
      expect(chatApi.list).toHaveBeenCalledTimes(2);
    });
  });
});
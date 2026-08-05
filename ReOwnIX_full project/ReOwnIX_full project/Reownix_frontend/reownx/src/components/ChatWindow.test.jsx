import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useParams } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import chatApi from '../services/chatApi';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

// Mock the chatApi service
vi.mock('../services/chatApi', () => ({
  default: {
    getMessages: vi.fn(),
    sendMessage: vi.fn(),
  },
}));

// Mock EmptyState to isolate the test and ensure it renders the passed prop
vi.mock('./EmptyState', () => ({
  default: ({ message }) => <div data-testid="empty-state">{message}</div>,
}));

describe('ChatWindow Component', () => {
  const mockChatId = 'chat-123';

  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ chatId: mockChatId });
    
    // JSDOM does not implement scrollIntoView, so we must mock it to prevent errors
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    delete window.HTMLElement.prototype.scrollIntoView;
  });

  it('renders a loading spinner initially', () => {
    // Return a promise that doesn't immediately resolve to keep it in loading state
    chatApi.getMessages.mockReturnValue(new Promise(() => {}));

    render(<ChatWindow />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders the EmptyState component when there are no messages', async () => {
    chatApi.getMessages.mockResolvedValue([]);

    render(<ChatWindow />);

    // Wait for the loading state to finish and EmptyState to render
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('No messages yet. Start the conversation!')).toBeInTheDocument();
    });
  });

  it('renders a list of messages correctly', async () => {
    const mockMessages = [
      { id: '1', content: 'Hello there!', isOwn: false, createdAt: '2023-10-01T10:00:00Z' },
      { id: '2', content: 'Hi, how are you?', isOwn: true, createdAt: '2023-10-01T10:05:00Z', read: true },
    ];
    chatApi.getMessages.mockResolvedValue(mockMessages);

    render(<ChatWindow />);

    await waitFor(() => {
      expect(screen.getByText('Hello there!')).toBeInTheDocument();
      expect(screen.getByText('Hi, how are you?')).toBeInTheDocument();
    });
    
    // Check if the read receipt tick is rendered for the own message
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('allows a user to type and send a new message via the send button', async () => {
    // We must provide at least 1 message, otherwise the component renders EmptyState and hides the input!
    chatApi.getMessages.mockResolvedValue([{ id: '1', content: 'Initial message', isOwn: false }]);
    chatApi.sendMessage.mockResolvedValue({
      id: '3',
      content: 'New message',
      isOwn: true,
      createdAt: new Date().toISOString(),
    });

    render(<ChatWindow />);

    // Wait for initial load to finish
    await waitFor(() => {
      expect(screen.getByText('Initial message')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Type a message...');
    
    // Type a message
    fireEvent.change(input, { target: { value: 'New message' } });
    expect(input.value).toBe('New message');

    // Find and click the send button
    const sendButton = screen.getByRole('button');
    expect(sendButton).not.toBeDisabled();
    fireEvent.click(sendButton);

    // Verify the API was called with the correct parameters
    await waitFor(() => {
      expect(chatApi.sendMessage).toHaveBeenCalledWith(mockChatId, { message: 'New message' });
    });

    // Verify input is cleared and the new message optimistically appears
    expect(input.value).toBe('');
    expect(screen.getByText('New message')).toBeInTheDocument();
  });

  it('allows a user to send a new message by pressing Enter', async () => {
    // Provide at least 1 message to ensure the input field renders
    chatApi.getMessages.mockResolvedValue([{ id: '1', content: 'Initial message', isOwn: false }]);
    chatApi.sendMessage.mockResolvedValue({
      id: '4',
      content: 'Enter message',
      isOwn: true,
      createdAt: new Date().toISOString(),
    });

    render(<ChatWindow />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Enter message' } });

    // Press Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: false });

    await waitFor(() => {
      expect(chatApi.sendMessage).toHaveBeenCalledWith(mockChatId, { message: 'Enter message' });
    });

    expect(screen.getByText('Enter message')).toBeInTheDocument();
  });

  it('does not send a message if the input is empty or just whitespace', async () => {
    // Provide at least 1 message to ensure the input field renders
    chatApi.getMessages.mockResolvedValue([{ id: '1', content: 'Initial message', isOwn: false }]);

    render(<ChatWindow />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Type a message...');
    
    // Try to send spaces
    fireEvent.change(input, { target: { value: '   ' } });
    
    // Button should be disabled based on the logic disabled={!newMessage.trim()}
    const sendButton = screen.getByRole('button');
    expect(sendButton).toBeDisabled();

    // Try sending via Enter key anyway
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: false });

    expect(chatApi.sendMessage).not.toHaveBeenCalled();
  });
});
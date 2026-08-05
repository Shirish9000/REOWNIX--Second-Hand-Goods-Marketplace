// src/components/common/GlobalWebSocket.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import toast from 'react-hot-toast';
import GlobalWebSocket from './GlobalWebSocket';
import { useAuth } from '../../context/AuthContext';
import webSocketService from '../../services/websocket';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mocks
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../services/websocket', () => ({
  default: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    subscribe: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
  },
}));

describe('GlobalWebSocket Component', () => {
  const unsubscribeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(webSocketService.subscribe).mockReturnValue(unsubscribeMock);
  });

  test('does not connect if user or token is missing', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null });

    render(<GlobalWebSocket />);

    expect(webSocketService.connect).not.toHaveBeenCalled();
    expect(webSocketService.subscribe).not.toHaveBeenCalled();
  });

  test('connects to webSocketService and subscribes when authenticated user and token exist', () => {
    localStorage.setItem('authToken', 'mock-jwt-token');
    vi.mocked(useAuth).mockReturnValue({ user: { userId: '123', email: 'user@test.com' } });

    render(<GlobalWebSocket />);

    expect(webSocketService.connect).toHaveBeenCalledWith('mock-jwt-token');
    expect(webSocketService.subscribe).toHaveBeenCalledWith(
      '/user/queue/notifications',
      expect.any(Function)
    );
  });

  test('handles chat message notification and dispatches custom event', () => {
    localStorage.setItem('authToken', 'mock-jwt-token');
    vi.mocked(useAuth).mockReturnValue({ user: { userId: '123' } });

    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    render(<GlobalWebSocket />);

    const subscriptionCallback = vi.mocked(webSocketService.subscribe).mock.calls[0][1];

    const chatNotification = {
      type: 'NEW_MESSAGE',
      senderName: 'Alice',
      messagePreview: 'Hello there!',
    };

    subscriptionCallback(chatNotification);

    expect(toast.success).toHaveBeenCalledWith(
      'New message from Alice: Hello there!',
      expect.objectContaining({ duration: 5000, icon: '💬' })
    );

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'reownx-new-chat-message' })
    );
  });

  test('handles standard object notification', () => {
    localStorage.setItem('authToken', 'mock-jwt-token');
    vi.mocked(useAuth).mockReturnValue({ user: { userId: '123' } });

    render(<GlobalWebSocket />);

    const subscriptionCallback = vi.mocked(webSocketService.subscribe).mock.calls[0][1];

    subscriptionCallback({ message: 'Auction won!' });

    expect(toast.success).toHaveBeenCalledWith('Auction won!', { duration: 5000 });
  });

  test('handles string notification payload', () => {
    localStorage.setItem('authToken', 'mock-jwt-token');
    vi.mocked(useAuth).mockReturnValue({ user: { userId: '123' } });

    render(<GlobalWebSocket />);

    const subscriptionCallback = vi.mocked(webSocketService.subscribe).mock.calls[0][1];

    subscriptionCallback('Bid updated');

    expect(toast.success).toHaveBeenCalledWith('Bid updated', { duration: 5000 });
  });

  test('unsubscribes and disconnects on unmount', () => {
    localStorage.setItem('authToken', 'mock-jwt-token');
    vi.mocked(useAuth).mockReturnValue({ user: { userId: '123' } });

    const { unmount } = render(<GlobalWebSocket />);

    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
    expect(webSocketService.disconnect).toHaveBeenCalled();
  });
});
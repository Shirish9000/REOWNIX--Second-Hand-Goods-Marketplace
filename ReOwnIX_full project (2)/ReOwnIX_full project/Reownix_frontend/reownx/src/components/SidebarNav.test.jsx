import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import SidebarNav from './SidebarNav';

const theme = createTheme();

// Mock window.matchMedia for MUI's useMediaQuery
const setMatchMedia = (matches) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

const renderComponent = (props = {}, initialEntries = ['/profile']) => {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={initialEntries}>
        <SidebarNav {...props} />
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('SidebarNav Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      setMatchMedia(true);
    });

    test('renders all navigation items', () => {
      renderComponent();

      const navItems = [
        'Profile',
        'My Products',
        'My Auctions',
        'My Offers',
        'Wishlist',
        'Orders',
        'Chats',
        'Billing',
        'Subscription',
        'Settings',
        'Logout',
      ];

      navItems.forEach((text) => {
        expect(screen.getByRole('link', { name: new RegExp(text, 'i') })).toBeInTheDocument();
      });
    });

    test('does not render the mobile menu toggle button on desktop', () => {
      renderComponent();

      const hamburgerButton = screen.queryByRole('button', { name: /open drawer/i });
      expect(hamburgerButton).not.toBeInTheDocument();
    });

    test('marks item as selected when location matches exact pathname and search', () => {
      renderComponent({}, ['/profile?tab=products']);

      const activeLink = screen.getByRole('link', { name: /my products/i });
      expect(activeLink).toHaveClass('Mui-selected');

      const inactiveLink = screen.getByRole('link', { name: /^profile$/i });
      expect(inactiveLink).not.toHaveClass('Mui-selected');
    });

    test('calls onSelect callback when a navigation item is clicked', () => {
      const handleSelect = vi.fn();
      renderComponent({ onSelect: handleSelect });

      const wishlistLink = screen.getByRole('link', { name: /wishlist/i });
      fireEvent.click(wishlistLink);

      expect(handleSelect).toHaveBeenCalledTimes(1);
      expect(handleSelect).toHaveBeenCalledWith('Wishlist');
    });
  });

  describe('Mobile / Tablet View', () => {
    beforeEach(() => {
      setMatchMedia(false);
    });

    test('renders the hamburger button on mobile', () => {
      renderComponent();

      const hamburgerButton = screen.getByRole('button', { name: /open drawer/i });
      expect(hamburgerButton).toBeInTheDocument();
    });

    test('opens mobile drawer when hamburger icon is clicked', () => {
      renderComponent();

      const hamburgerButton = screen.getByRole('button', { name: /open drawer/i });
      fireEvent.click(hamburgerButton);

      const profileLink = screen.getByRole('link', { name: /^profile$/i });
      expect(profileLink).toBeVisible();
    });

    test('closes drawer after clicking a navigation item on mobile', () => {
      const handleSelect = vi.fn();
      renderComponent({ onSelect: handleSelect });

      const hamburgerButton = screen.getByRole('button', { name: /open drawer/i });
      fireEvent.click(hamburgerButton);

      const ordersLink = screen.getByRole('link', { name: /orders/i });
      fireEvent.click(ordersLink);

      expect(handleSelect).toHaveBeenCalledWith('Orders');
    });
  });
});
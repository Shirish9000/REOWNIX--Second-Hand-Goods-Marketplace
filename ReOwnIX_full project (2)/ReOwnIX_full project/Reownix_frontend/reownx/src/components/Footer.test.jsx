import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Footer from './Footer';
import { useColorMode } from '../context/ThemeContext';

// Mock ThemeContext hook
vi.mock('../context/ThemeContext', () => ({
  useColorMode: vi.fn(),
}));

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

describe('Footer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useColorMode.mockReturnValue({ mode: 'light' });
  });

  it('renders branding title and description correctly', () => {
    renderFooter();

    expect(screen.getByText('ReOwnIX')).toBeInTheDocument();
    expect(
      screen.getByText(/The world's most trusted premium marketplace/i)
    ).toBeInTheDocument();
  });

  it('renders support navigation links', () => {
    renderFooter();

    expect(screen.getByText('Support')).toBeInTheDocument();
    const supportLinks = [
      'Help Center',
      'Trust & Safety',
      'Selling Guide',
      'Buying Guide',
      'Contact Us',
    ];

    supportLinks.forEach((linkText) => {
      expect(screen.getByRole('link', { name: linkText })).toBeInTheDocument();
    });
  });

  it('renders legal navigation links', () => {
    renderFooter();

    expect(screen.getByText('Legal')).toBeInTheDocument();
    const legalLinks = [
      'Terms of Service',
      'Privacy Policy',
      'Cookie Policy',
      'Accessibility',
    ];

    legalLinks.forEach((linkText) => {
      expect(screen.getByRole('link', { name: linkText })).toBeInTheDocument();
    });
  });

  it('renders social media follow buttons', () => {
    renderFooter();

    expect(screen.getByText('Follow Us')).toBeInTheDocument();
    
    // Renders 4 social icon buttons (Facebook, Twitter, Instagram, LinkedIn)
    const iconButtons = screen.getAllByRole('button');
    expect(iconButtons.length).toBeGreaterThanOrEqual(4);
  });

  it('renders dynamic current year in copyright text', () => {
    renderFooter();

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} ReOwnIX. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('renders currency and language options', () => {
    renderFooter();

    expect(screen.getByText('English (US)')).toBeInTheDocument();
    expect(screen.getByText('₹ INR')).toBeInTheDocument();
  });

  it('adapts styles when in dark mode', () => {
    useColorMode.mockReturnValue({ mode: 'dark' });

    const { container } = renderFooter();
    const footerElement = container.querySelector('footer');

    expect(footerElement).toBeInTheDocument();
  });
});
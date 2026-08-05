import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import CountdownTimer from './CountdownTimer';

describe('CountdownTimer Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders "Ended" when endDate is missing or in the past', () => {
    const pastDate = new Date(Date.now() - 10000).toISOString();
    render(<CountdownTimer endDate={pastDate} />);

    expect(screen.getByText('Ended')).toBeInTheDocument();
  });

  it('renders formatted time remaining when target date is in the future', () => {
    // Set fixed current time: 2026-01-01T00:00:00Z
    const now = new Date('2026-01-01T00:00:00Z');
    vi.setSystemTime(now);

    // End date 2 days, 3 hours, 4 minutes, and 5 seconds later
    const futureDate = new Date('2026-01-03T03:04:05Z').toISOString();
    render(<CountdownTimer endDate={futureDate} />);

    expect(screen.getByText('2d 03:04:05')).toBeInTheDocument();
  });

  it('omits days when remaining time is under 24 hours', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    vi.setSystemTime(now);

    // 1 hour, 2 minutes, 3 seconds remaining
    const futureDate = new Date('2026-01-01T01:02:03Z').toISOString();
    render(<CountdownTimer endDate={futureDate} />);

    expect(screen.getByText('01:02:03')).toBeInTheDocument();
  });

  it('updates countdown every second', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    vi.setSystemTime(now);

    const futureDate = new Date('2026-01-01T00:00:03Z').toISOString();
    render(<CountdownTimer endDate={futureDate} />);

    expect(screen.getByText('00:00:03')).toBeInTheDocument();

    // Advance 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('00:00:02')).toBeInTheDocument();

    // Advance another 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('00:00:01')).toBeInTheDocument();
  });

  it('switches to "Ended" state when countdown reaches zero', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    vi.setSystemTime(now);

    const futureDate = new Date('2026-01-01T00:00:01Z').toISOString();
    render(<CountdownTimer endDate={futureDate} />);

    expect(screen.getByText('00:00:01')).toBeInTheDocument();

    // Advance past expiration
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Ended')).toBeInTheDocument();
  });

  it('clears interval timer on component unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const futureDate = new Date(Date.now() + 10000).toISOString();

    const { unmount } = render(<CountdownTimer endDate={futureDate} />);
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
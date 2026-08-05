// src/components/Countdown.test.jsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import Countdown from './Countdown';

describe('Countdown Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders "Ended" immediately when status is ENDED or CANCELLED', () => {
    const { rerender } = render(
      <Countdown status="ENDED" endTime="2026-12-31T23:59:59Z" />
    );
    expect(screen.getByText('Ended')).toBeInTheDocument();

    rerender(<Countdown status="CANCELLED" endTime="2026-12-31T23:59:59Z" />);
    expect(screen.getByText('Ended')).toBeInTheDocument();
  });

  test('renders "Ended" when current time is past endTime', () => {
    // Fixed current time: Aug 4, 2026, 10:00:00 AM
    const now = new Date('2026-08-04T10:00:00Z');
    vi.setSystemTime(now);

    const pastEndTime = '2026-08-04T09:59:59Z';
    render(<Countdown endTime={pastEndTime} />);

    expect(screen.getByText('Ended')).toBeInTheDocument();
  });

  test('formats days, hours, minutes, and seconds correctly for normal urgency (> 5 min)', () => {
    const now = new Date('2026-08-04T10:00:00Z');
    vi.setSystemTime(now);

    // 1 day, 2 hours, 3 minutes, 4 seconds into future
    const futureEndTime = new Date(
      now.getTime() + (1 * 24 * 3600 + 2 * 3600 + 3 * 60 + 4) * 1000
    ).toISOString();

    render(<Countdown endTime={futureEndTime} />);

    expect(screen.getByText('1d 02h 03m 04s')).toBeInTheDocument();
  });

  test('updates remaining time every second', () => {
    const now = new Date('2026-08-04T10:00:00Z');
    vi.setSystemTime(now);

    // 10 minutes into the future
    const futureEndTime = new Date(now.getTime() + 10 * 60 * 1000).toISOString();

    render(<Countdown endTime={futureEndTime} />);
    expect(screen.getByText('10m 00s')).toBeInTheDocument();

    // Advance timer by 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('09m 59s')).toBeInTheDocument();
  });

  test('transitions into warning threshold (< 5 min remaining)', () => {
    const now = new Date('2026-08-04T10:00:00Z');
    vi.setSystemTime(now);

    // 4 minutes 30 seconds into future (Warning state)
    const warningTime = new Date(now.getTime() + (4 * 60 + 30) * 1000).toISOString();

    render(<Countdown endTime={warningTime} />);

    const timeElement = screen.getByText('04m 30s');
    expect(timeElement).toBeInTheDocument();
  });

  test('transitions into critical threshold (< 1 min remaining)', () => {
    const now = new Date('2026-08-04T10:00:00Z');
    vi.setSystemTime(now);

    // 45 seconds into future (Critical state)
    const criticalTime = new Date(now.getTime() + 45 * 1000).toISOString();

    render(<Countdown endTime={criticalTime} />);

    const timeElement = screen.getByText('00m 45s');
    expect(timeElement).toBeInTheDocument();
  });

  test('clears interval timer on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const futureTime = new Date(Date.now() + 60000).toISOString();

    const { unmount } = render(<Countdown endTime={futureTime} />);
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
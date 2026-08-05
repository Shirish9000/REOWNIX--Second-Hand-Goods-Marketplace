import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardOverview from './DashboardOverview';

// Mock Recharts container & chart components to pass through children cleanly in JS DOM
vi.mock('recharts', async () => {
  const originalModule = await vi.importActual('recharts');
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }) => (
      <div data-testid="responsive-container" style={{ width: 800, height: 200 }}>
        {children}
      </div>
    ),
    LineChart: ({ children, data }) => (
      <div data-testid="line-chart" data-points={data?.length}>
        {children}
      </div>
    ),
    XAxis: ({ dataKey }) => <div data-testid="x-axis" data-key={dataKey} />,
    Line: ({ dataKey }) => <div data-testid="line" data-key={dataKey} />,
    YAxis: () => null,
    Tooltip: () => null,
    CartesianGrid: () => null,
  };
});

describe('DashboardOverview Component', () => {
  beforeEach(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  it('renders section headers correctly', () => {
    render(<DashboardOverview />);

    expect(screen.getByText('Weekly Views')).toBeInTheDocument();
    expect(screen.getByText('Weekly Revenue ($)')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity (Placeholder)')).toBeInTheDocument();
  });

  it('renders the placeholder description for recent activity', () => {
    render(<DashboardOverview />);

    expect(
      screen.getByText('This area will show recent messages, offers, auctions, and orders.')
    ).toBeInTheDocument();
  });

  it('renders both chart containers', () => {
    render(<DashboardOverview />);

    const containers = screen.getAllByTestId('responsive-container');
    expect(containers).toHaveLength(2);
  });

  it('configures X-Axis, Line data keys, and chart dataset length correctly', () => {
    render(<DashboardOverview />);

    // Verify LineChart received sample data array (7 days)
    const charts = screen.getAllByTestId('line-chart');
    expect(charts).toHaveLength(2);
    charts.forEach((chart) => {
      expect(chart).toHaveAttribute('data-points', '7');
    });

    // Verify XAxis keys
    const xAxes = screen.getAllByTestId('x-axis');
    expect(xAxes).toHaveLength(2);
    xAxes.forEach((axis) => {
      expect(axis).toHaveAttribute('data-key', 'day');
    });

    // Verify Line keys for views and revenue
    const lines = screen.getAllByTestId('line');
    expect(lines[0]).toHaveAttribute('data-key', 'views');
    expect(lines[1]).toHaveAttribute('data-key', 'revenue');
  });
});
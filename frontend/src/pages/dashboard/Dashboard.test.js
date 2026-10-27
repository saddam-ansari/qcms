import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import api from '../../services/api';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../redux/authSlice';

// Mock the API service
jest.mock('../../services/api');

// Helper to create a mock store
const createMockStore = (initialState = {}) => {
  const defaultState = {
    auth: {
      token: 'test-token',
      role: 'user',
      userId: '123',
      ...initialState.auth,
    },
  };

  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: defaultState,
  });
};

// Helper to render component with Redux and Router
const renderWithProviders = (component, { initialState = {}, store = null } = {}) => {
  const testStore = store || createMockStore(initialState);

  return render(
    <Provider store={testStore}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard heading', () => {
    api.get.mockResolvedValue({ data: {} });
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Quality Control Dashboard')).toBeInTheDocument();
  });

  test('renders inspection summary section', () => {
    api.get.mockResolvedValue({ data: {} });
    renderWithProviders(<Dashboard />);

    return waitFor(() => expect(screen.getByText('Inspection Summary')).toBeInTheDocument());
  });

  test('renders defect summary section', async () => {
    api.get.mockResolvedValue({ data: {} });
    renderWithProviders(<Dashboard />);

    await waitFor(() => expect(screen.getByText('Defect Summary')).toBeInTheDocument());
  });

  test('fetches and displays dashboard data on mount', async () => {
    const mockDashboardData = {
      totalInspection: 10,
      completedInspection: 7,
      pendingInspection: 3,
      totalDefects: 5,
      completedDefects: 3,
      pendingDefects: 2,
      lowSeverity: 1,
      mediumSeverity: 2,
      highSeverity: 2,
    };

    api.get.mockResolvedValue({ data: mockDashboardData });
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // totalInspection
      expect(screen.getByText('7')).toBeInTheDocument(); // completedInspection
      expect(screen.getByText('3')).toBeInTheDocument(); // pendingInspection
      expect(screen.getByText('5')).toBeInTheDocument(); // totalDefects
    });
  });

  test('displays all inspection metrics', async () => {
    const mockDashboardData = {
      totalInspection: 10,
      completedInspection: 7,
      pendingInspection: 3,
      totalDefects: 0,
      completedDefects: 0,
      pendingDefects: 0,
      lowSeverity: 0,
      mediumSeverity: 0,
      highSeverity: 0,
    };

    api.get.mockResolvedValue({ data: mockDashboardData });
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total Inspections')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    const completedCards = screen.getAllByText('Completed');
    expect(completedCards.length).toBeGreaterThan(0);
    const pendingCards = screen.getAllByText('Pending');
    expect(pendingCards.length).toBeGreaterThan(0);
  });

  test('displays all defect metrics', async () => {
    const mockDashboardData = {
      totalInspection: 0,
      completedInspection: 0,
      pendingInspection: 0,
      totalDefects: 8,
      completedDefects: 5,
      pendingDefects: 3,
      lowSeverity: 0,
      mediumSeverity: 0,
      highSeverity: 0,
    };

    api.get.mockResolvedValue({ data: mockDashboardData });
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total Defects')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });
  });

  test('displays severity levels', async () => {
    const mockDashboardData = {
      totalInspection: 0,
      completedInspection: 0,
      pendingInspection: 0,
      totalDefects: 0,
      completedDefects: 0,
      pendingDefects: 0,
      lowSeverity: 2,
      mediumSeverity: 3,
      highSeverity: 4,
    };

    api.get.mockResolvedValue({ data: mockDashboardData });
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Low Severity')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Medium Severity')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('High Severity')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });

  test('renders navigation buttons', () => {
    api.get.mockResolvedValue({ data: {} });
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Manage Inspections')).toBeInTheDocument();
    expect(screen.getByText('Manage Defects')).toBeInTheDocument();
  });

  test('navigation buttons have correct links', () => {
    api.get.mockResolvedValue({ data: {} });
    renderWithProviders(<Dashboard />);

    const inspectionButton = screen.getByRole('link', { name: /manage inspections/i }).getAttribute('href');
    const defectButton = screen.getByRole('link', { name: /manage defects/i }).getAttribute('href');

    expect(inspectionButton).toBe('/inspections');
    expect(defectButton).toBe('/defects');
  });

  test('handles API error gracefully', async () => {
    api.get.mockRejectedValue(new Error('API Error'));
    renderWithProviders(<Dashboard />);

    expect(await screen.findByRole('alertdialog')).toHaveTextContent(
      'Unable to load dashboard data'
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  test('retries after a dashboard load error', async () => {
    api.get
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce({ data: { totalInspection: 4 } });
    renderWithProviders(<Dashboard />);

    fireEvent.click(await screen.findByRole('button', { name: 'Retry' }));

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(2);
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });

  test('calls API endpoint /dashboard on component mount', async () => {
    api.get.mockResolvedValue({ data: {} });
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('uses zero values for missing metrics after loading', async () => {
    api.get.mockResolvedValue({ data: {} });
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      const zeroElements = screen.getAllByText('0');
      expect(zeroElements.length).toBe(9);
    });
  });

  test('updates state when API returns data', async () => {
    const { rerender } = renderWithProviders(<Dashboard />);

    api.get.mockResolvedValue({
      data: {
        totalInspection: 5,
        completedInspection: 3,
        pendingInspection: 2,
        totalDefects: 4,
        completedDefects: 2,
        pendingDefects: 2,
        lowSeverity: 1,
        mediumSeverity: 1,
        highSeverity: 2,
      },
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  test('renders cards with proper structure', async () => {
    const mockDashboardData = {
      totalInspection: 15,
      completedInspection: 10,
      pendingInspection: 5,
      totalDefects: 8,
      completedDefects: 5,
      pendingDefects: 3,
      lowSeverity: 2,
      mediumSeverity: 3,
      highSeverity: 3,
    };

    api.get.mockResolvedValue({ data: mockDashboardData });
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total Inspections')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    // Verify cards container exists by checking multiple metric headings
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.length).toBeGreaterThan(0);
  });

  test('displays all data categories', async () => {
    const mockDashboardData = {
      totalInspection: 20,
      completedInspection: 15,
      pendingInspection: 5,
      totalDefects: 10,
      completedDefects: 7,
      pendingDefects: 3,
      lowSeverity: 3,
      mediumSeverity: 4,
      highSeverity: 3,
    };

    api.get.mockResolvedValue({ data: mockDashboardData });
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      // Inspection metrics
      expect(screen.getByText('Total Inspections')).toBeInTheDocument();
      
      // Defect metrics
      expect(screen.getByText('Total Defects')).toBeInTheDocument();
      
      // Severity metrics
      expect(screen.getByText('Low Severity')).toBeInTheDocument();
      expect(screen.getByText('Medium Severity')).toBeInTheDocument();
      expect(screen.getByText('High Severity')).toBeInTheDocument();
    });
  });

  test('only calls API once on initial mount', async () => {
    api.get.mockResolvedValue({ data: {} });
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1);
    });
  });

  test('renders with Redux store context', () => {
    api.get.mockResolvedValue({ data: {} });
    const store = createMockStore({ auth: { role: 'admin' } });

    renderWithProviders(<Dashboard />, { store });

    expect(screen.getByText('Quality Control Dashboard')).toBeInTheDocument();
  });

  test('handles zero data values correctly', async () => {
    const mockDashboardData = {
      totalInspection: 0,
      completedInspection: 0,
      pendingInspection: 0,
      totalDefects: 0,
      completedDefects: 0,
      pendingDefects: 0,
      lowSeverity: 0,
      mediumSeverity: 0,
      highSeverity: 0,
    };

    api.get.mockResolvedValue({ data: mockDashboardData });
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      const zeroElements = screen.getAllByText('0');
      expect(zeroElements.length).toBe(9); // All 9 metrics are 0
    });
  });

  test('displays large numbers correctly', async () => {
    const mockDashboardData = {
      totalInspection: 1000,
      completedInspection: 750,
      pendingInspection: 250,
      totalDefects: 500,
      completedDefects: 350,
      pendingDefects: 150,
      lowSeverity: 100,
      mediumSeverity: 200,
      highSeverity: 200,
    };

    api.get.mockResolvedValue({ data: mockDashboardData });
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('750')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useEpisodes } from './useEpisodes';
import * as api from '@/utils/api';
import { Episode } from '@/utils/types';

vi.mock('@/utils/api', () => ({
  getEpisodesByIds: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useEpisodes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get episodes when valid IDs are passed', async () => {
    const mockEpisodes: Episode[] = [
      {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z',
      },
      {
        id: 2,
        name: 'Lawnmower Dog',
        air_date: 'December 9, 2013',
        episode: 'S01E02',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/2',
        created: '2017-11-10T12:56:33.916Z',
      },
    ];

    vi.mocked(api.getEpisodesByIds).mockResolvedValueOnce(mockEpisodes);

    const { result } = renderHook(() => useEpisodes([1, 2]), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockEpisodes);
    expect(api.getEpisodesByIds).toHaveBeenCalledWith([1, 2]);
  });

  it('should not make request when IDs array is empty', () => {
    const { result } = renderHook(() => useEpisodes([]), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(api.getEpisodesByIds).not.toHaveBeenCalled();
  });

  it('should be disabled when IDs array is empty', () => {
    const { result } = renderHook(() => useEpisodes([]), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });

  it('should handle errors correctly', async () => {
    const error = new Error('Network error');
    vi.mocked(api.getEpisodesByIds).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useEpisodes([1]), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });

  it('should update query when IDs change', async () => {
    const mockEpisodes1: Episode[] = [
      {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z',
      },
    ];

    const mockEpisodes2: Episode[] = [
      {
        id: 2,
        name: 'Lawnmower Dog',
        air_date: 'December 9, 2013',
        episode: 'S01E02',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/2',
        created: '2017-11-10T12:56:33.916Z',
      },
    ];

    vi.mocked(api.getEpisodesByIds)
      .mockResolvedValueOnce(mockEpisodes1)
      .mockResolvedValueOnce(mockEpisodes2);

    const { result, rerender } = renderHook(
      ({ ids }: { ids: number[] }) => useEpisodes(ids),
      {
        wrapper: createWrapper(),
        initialProps: { ids: [1] },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockEpisodes1);

    rerender({ ids: [2] });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockEpisodes2);
    });

    expect(api.getEpisodesByIds).toHaveBeenCalledWith([2]);
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useCharacters } from './useCharacters';
import * as api from '@/utils/api';
import { CharactersResponse } from '@/utils/types';

vi.mock('@/utils/api', () => ({
  getCharacters: vi.fn(),
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

describe('useCharacters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get characters correctly', async () => {
    const mockResponse: CharactersResponse = {
      info: {
        count: 826,
        pages: 42,
        next: 'https://rickandmortyapi.com/api/character?page=2',
        prev: null,
      },
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          type: '',
          gender: 'Male',
          origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
          location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
          image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          episode: ['https://rickandmortyapi.com/api/episode/1'],
          url: 'https://rickandmortyapi.com/api/character/1',
          created: '2017-11-04T18:48:46.250Z',
        },
      ],
    };

    vi.mocked(api.getCharacters).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCharacters(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pages[0]).toEqual(mockResponse);
    expect(api.getCharacters).toHaveBeenCalledWith(1);
  });

  it('should calculate next page parameter correctly', async () => {
    const mockResponse: CharactersResponse = {
      info: {
        count: 826,
        pages: 42,
        next: 'https://rickandmortyapi.com/api/character?page=2',
        prev: null,
      },
      results: [],
    };

    vi.mocked(api.getCharacters).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCharacters(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hasNextPage).toBe(true);

    await result.current.fetchNextPage();

    await waitFor(() => {
      expect(api.getCharacters).toHaveBeenCalledWith(2);
    });
  });

  it('should return undefined when there is no next page', async () => {
    const mockResponse: CharactersResponse = {
      info: {
        count: 826,
        pages: 42,
        next: null,
        prev: 'https://rickandmortyapi.com/api/character?page=41',
      },
      results: [],
    };

    vi.mocked(api.getCharacters).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCharacters(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hasNextPage).toBe(false);
  });

  it('should handle errors correctly', async () => {
    const error = new Error('Network error');
    vi.mocked(api.getCharacters).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCharacters(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

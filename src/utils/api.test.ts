import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCharacters, getEpisodesByIds } from './api';
import { CharactersResponse, Episode } from './types';

global.fetch = vi.fn();

describe('API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getCharacters', () => {
    it('should get characters without specified page', async () => {
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
            origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
            location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
            image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
            episode: ['https://rickandmortyapi.com/api/episode/1'],
            url: 'https://rickandmortyapi.com/api/character/1',
            created: '2017-11-04T18:48:46.250Z',
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getCharacters();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should get characters with specified page', async () => {
      const mockResponse: CharactersResponse = {
        info: {
          count: 826,
          pages: 42,
          next: 'https://rickandmortyapi.com/api/character?page=3',
          prev: 'https://rickandmortyapi.com/api/character?page=1',
        },
        results: [],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getCharacters(2);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character?page=2'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when response is not successful', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getCharacters()).rejects.toThrow('Error en la petición: 404 Not Found');
    });
  });

  describe('getEpisodesByIds', () => {
    it('should get multiple episodes when multiple IDs are passed', async () => {
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

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEpisodes,
      });

      const result = await getEpisodesByIds([1, 2]);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/episode/1,2'
      );
      expect(result).toEqual(mockEpisodes);
    });

    it('should get single episode when one ID is passed', async () => {
      const mockEpisode: Episode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEpisode,
      });

      const result = await getEpisodesByIds([1]);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/episode/1'
      );
      expect(result).toEqual([mockEpisode]);
    });

    it('should return empty array when response is null', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      });

      const result = await getEpisodesByIds([999]);

      expect(result).toEqual([]);
    });

    it('should convert single object to array when response is not an array', async () => {
      const mockEpisode: Episode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/1',
        created: '2017-11-10T12:56:33.798Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEpisode,
      });

      const result = await getEpisodesByIds([1]);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([mockEpisode]);
    });

    it('should throw error when response is not successful', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(getEpisodesByIds([1])).rejects.toThrow(
        'Error en la petición: 500 Internal Server Error'
      );
    });
  });
});

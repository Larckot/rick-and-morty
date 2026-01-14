import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCharacterStore } from './useCharacterStore';
import { Character, Episode } from '@/utils/types';
import * as api from '@/utils/api';

vi.mock('@/utils/api', () => ({
  getEpisodesByIds: vi.fn(),
}));

describe('useCharacterStore', () => {
  beforeEach(() => {
    useCharacterStore.getState().clear();
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should have correct initial values', () => {
      const state = useCharacterStore.getState();

      expect(state.firstId).toBeNull();
      expect(state.secondId).toBeNull();
      expect(state.firstCharacterEpisodes).toBeNull();
      expect(state.secondCharacterEpisodes).toBeNull();
      expect(state.isLoadingEpisodes).toBe(false);
    });
  });

  describe('selectFirst', () => {
    it('should select first character and load its episodes', async () => {
      const mockCharacter: Character = {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        episode: [
          'https://rickandmortyapi.com/api/episode/1',
          'https://rickandmortyapi.com/api/episode/2',
        ],
        url: 'https://rickandmortyapi.com/api/character/1',
        created: '2017-11-04T18:48:46.250Z',
      };

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

      await useCharacterStore.getState().selectFirst(mockCharacter);

      const state = useCharacterStore.getState();

      expect(state.firstId).toBe(1);
      expect(state.firstCharacterEpisodes).toEqual(mockEpisodes);
      expect(state.isLoadingEpisodes).toBe(false);
      expect(api.getEpisodesByIds).toHaveBeenCalledWith([1, 2]);
    });

    it('should handle errors when loading episodes', async () => {
      const mockCharacter: Character = {
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
      };

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(api.getEpisodesByIds).mockRejectedValueOnce(new Error('Network error'));

      await useCharacterStore.getState().selectFirst(mockCharacter);

      const state = useCharacterStore.getState();

      expect(state.firstId).toBe(1);
      expect(state.firstCharacterEpisodes).toBeNull();
      expect(state.isLoadingEpisodes).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('selectSecond', () => {
    it('should select second character and load its episodes', async () => {
      const mockCharacter: Character = {
        id: 2,
        name: 'Morty Smith',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
        episode: ['https://rickandmortyapi.com/api/episode/1'],
        url: 'https://rickandmortyapi.com/api/character/2',
        created: '2017-11-04T18:48:46.250Z',
      };

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
      ];

      vi.mocked(api.getEpisodesByIds).mockResolvedValueOnce(mockEpisodes);

      await useCharacterStore.getState().selectSecond(mockCharacter);

      const state = useCharacterStore.getState();

      expect(state.secondId).toBe(2);
      expect(state.secondCharacterEpisodes).toEqual(mockEpisodes);
      expect(state.isLoadingEpisodes).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all store state', async () => {
      const mockCharacter: Character = {
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
      };

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
      ];

      vi.mocked(api.getEpisodesByIds).mockResolvedValue(mockEpisodes);

      await useCharacterStore.getState().selectFirst(mockCharacter);
      await useCharacterStore.getState().selectSecond(mockCharacter);

      useCharacterStore.getState().clear();

      const state = useCharacterStore.getState();

      expect(state.firstId).toBeNull();
      expect(state.secondId).toBeNull();
      expect(state.firstCharacterEpisodes).toBeNull();
      expect(state.secondCharacterEpisodes).toBeNull();
      expect(state.isLoadingEpisodes).toBe(false);
    });
  });
});

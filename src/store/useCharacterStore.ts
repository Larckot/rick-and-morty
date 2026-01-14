import { create } from 'zustand';
import { Character, Episode } from '@/utils/types';
import { getEpisodesByIds } from '@/utils/api';

type CharacterStore = {
  firstId: number | null;
  secondId: number | null;
  firstCharacterEpisodes: Episode[] | null;
  secondCharacterEpisodes: Episode[] | null;
  isLoadingEpisodes: boolean;
  selectFirst: (character: Character) => Promise<void>;
  selectSecond: (character: Character) => Promise<void>;
  clear: () => void;
};

function extractEpisodeIds(episodeUrls: string[]): number[] {
  return episodeUrls
    .map((url) => {
      const match = url.match(/\/(\d+)$/);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((id): id is number => id !== null);
}

export const useCharacterStore = create<CharacterStore>((set) => ({
  firstId: null,
  secondId: null,
  firstCharacterEpisodes: null,
  secondCharacterEpisodes: null,
  isLoadingEpisodes: false,

  selectFirst: async (character) => {
    const episodeIds = extractEpisodeIds(character.episode);
    
    set((s) => ({
      ...s,
      firstId: character.id,
      firstCharacterEpisodes: null,
      isLoadingEpisodes: true,
    }));

    try {
      const episodes = await getEpisodesByIds(episodeIds);
      set((s) => ({
        ...s,
        firstCharacterEpisodes: episodes,
        isLoadingEpisodes: false,
      }));
    } catch (error) {
      console.error('Error al cargar episodios del primer personaje:', error);
      set((s) => ({
        ...s,
        isLoadingEpisodes: false,
      }));
    }
  },

  selectSecond: async (character) => {
    const episodeIds = extractEpisodeIds(character.episode);
    
    set((s) => ({
      ...s,
      secondId: character.id,
      secondCharacterEpisodes: null,
      isLoadingEpisodes: true,
    }));

    try {
      const episodes = await getEpisodesByIds(episodeIds);
      set((s) => ({
        ...s,
        secondCharacterEpisodes: episodes,
        isLoadingEpisodes: false,
      }));
    } catch (error) {
      console.error('Error al cargar episodios del segundo personaje:', error);
      set((s) => ({
        ...s,
        isLoadingEpisodes: false,
      }));
    }
  },

  clear: () =>
    set({
      firstId: null,
      secondId: null,
      firstCharacterEpisodes: null,
      secondCharacterEpisodes: null,
      isLoadingEpisodes: false,
    }),
}));

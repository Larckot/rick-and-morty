import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EpisodesResult from './index';
import { useCharacterStore } from '@/store/useCharacterStore';
import { Episode } from '@/utils/types';

describe('EpisodesResult', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCharacterStore.getState().clear();
  });

  it('should render three EpisodesList components', () => {
    useCharacterStore.setState({
      firstCharacterEpisodes: null,
      secondCharacterEpisodes: null,
      firstId: null,
      secondId: null,
      isLoadingEpisodes: false,
    });

    render(<EpisodesResult />);

    expect(screen.getByText('Character #1 - Only Episodes')).toBeInTheDocument();
    expect(screen.getByText('Character #1 & #2 - Shared Episodes')).toBeInTheDocument();
    expect(screen.getByText('Character #2 - Only Episodes')).toBeInTheDocument();
  });

  it('should calculate shared episodes correctly', () => {
    const firstEpisodes: Episode[] = [
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

    const secondEpisodes: Episode[] = [
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
        id: 3,
        name: 'Anatomy Park',
        air_date: 'December 16, 2013',
        episode: 'S01E03',
        characters: [],
        url: 'https://rickandmortyapi.com/api/episode/3',
        created: '2017-11-10T12:56:33.916Z',
      },
    ];

    useCharacterStore.setState({
      firstCharacterEpisodes: firstEpisodes,
      secondCharacterEpisodes: secondEpisodes,
      firstId: 1,
      secondId: 2,
      isLoadingEpisodes: false,
    });

    render(<EpisodesResult />);

    expect(screen.getAllByText(/S01E01/).length).toBeGreaterThan(0);
    expect(screen.getByText(/S01E02/)).toBeInTheDocument();
    expect(screen.getByText(/S01E03/)).toBeInTheDocument();
  });

  it('should show data when both characters are selected', () => {
    const episodes: Episode[] = [
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

    useCharacterStore.setState({
      firstCharacterEpisodes: episodes,
      secondCharacterEpisodes: episodes,
      firstId: 1,
      secondId: 2,
      isLoadingEpisodes: false,
    });

    render(<EpisodesResult />);

    expect(screen.queryByText('Select both characters to see results')).not.toBeInTheDocument();
  });

  it('should not show data when characters are not selected', () => {
    useCharacterStore.setState({
      firstCharacterEpisodes: null,
      secondCharacterEpisodes: null,
      firstId: null,
      secondId: null,
      isLoadingEpisodes: false,
    });

    render(<EpisodesResult />);

    expect(screen.getAllByText('Select both characters to see results')).toHaveLength(3);
  });

  it('should show only first character episodes when second is not selected', () => {
    const episodes: Episode[] = [
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

    useCharacterStore.setState({
      firstCharacterEpisodes: episodes,
      secondCharacterEpisodes: null,
      firstId: 1,
      secondId: null,
      isLoadingEpisodes: false,
    });

    render(<EpisodesResult />);

    expect(screen.getAllByText('Select both characters to see results')).toHaveLength(3);
  });
});

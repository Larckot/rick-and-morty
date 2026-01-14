import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EpisodesList from './index';
import { Episode } from '@/utils/types';

describe('EpisodesList', () => {
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

  it('should render title correctly', () => {
    render(
      <EpisodesList
        showData={false}
        episodes={null}
        title="Test Title"
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should show message when showData is false', () => {
    render(
      <EpisodesList
        showData={false}
        episodes={null}
        title="Test Title"
      />
    );

    expect(screen.getByText('Select both characters to see results')).toBeInTheDocument();
  });

  it('should render episodes list when showData is true and episodes exist', () => {
    render(
      <EpisodesList
        showData={true}
        episodes={mockEpisodes}
        title="Test Title"
      />
    );

    expect(screen.getByText(/S01E01/)).toBeInTheDocument();
    expect(screen.getByText(/Pilot/)).toBeInTheDocument();
    expect(screen.getByText(/December 2, 2013/)).toBeInTheDocument();
    expect(screen.getByText(/S01E02/)).toBeInTheDocument();
    expect(screen.getByText(/Lawnmower Dog/)).toBeInTheDocument();
    expect(screen.getByText(/December 9, 2013/)).toBeInTheDocument();
  });

  it('should show message when episodes array is empty', () => {
    render(
      <EpisodesList
        showData={true}
        episodes={[]}
        title="Test Title"
      />
    );

    expect(screen.getByText('These characters do not share episodes.')).toBeInTheDocument();
  });

  it('should show message when episodes is null', () => {
    render(
      <EpisodesList
        showData={true}
        episodes={null}
        title="Test Title"
      />
    );

    expect(screen.getByText('These characters do not share episodes.')).toBeInTheDocument();
  });

  it('should format episode information correctly', () => {
    render(
      <EpisodesList
        showData={true}
        episodes={mockEpisodes}
        title="Test Title"
      />
    );

    const episode1 = screen.getByText(/S01E01/).closest('p');
    expect(episode1).toBeInTheDocument();
    expect(episode1?.textContent).toContain('Pilot');
    expect(episode1?.textContent).toContain('December 2, 2013');
  });
});

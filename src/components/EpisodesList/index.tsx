'use client';

import { Episode } from '@/utils/types';

import styles from './EpisodesList.module.css';

interface EpisodesListProps {
    showData: boolean;
    episodes: Episode[] | null;
    title: string;
}

export default function EpisodesList({showData, episodes, title}: EpisodesListProps) {
  const episodesList = () => {
    if (episodes && episodes.length > 0) return (
      episodes.map(({episode, name, air_date}) => (
        <p key={episode}>
          <b>
            {episode}
          </b>
          {` - ${name} - ${air_date}`}
        </p>
      ))
    );

    return (
      <p className={styles.noEpisodes}>These characters do not share episodes.</p>
    );
  }

  return (
    <div className={styles.episodesList}>
        <h2>{title}</h2>
        <div className={styles.episodes}>
        {showData && (
          episodesList()
        )}
        {!showData && (
          <p>Select both characters to see results</p>
        )}
        </div>
    </div>
  );
}

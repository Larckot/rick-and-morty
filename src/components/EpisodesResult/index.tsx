'use client';

import { useCharacterStore } from '@/store/useCharacterStore';
import EpisodesList from '../EpisodesList';

import styles from './EpisodesResult.module.css';


export default function EpisodesResult() {
    const { firstCharacterEpisodes, secondCharacterEpisodes} = useCharacterStore();

    const idsSecondList = new Set(secondCharacterEpisodes?.map((item) => item.id));

    const repeatedEpisodes = firstCharacterEpisodes?.filter((item) =>
      idsSecondList?.has(item.id)
    ) || null;

    const showData = !!(firstCharacterEpisodes && secondCharacterEpisodes);

  return (
    <div className={styles.episodesResult}>
        <EpisodesList title='Character #1 - Only Episodes' episodes={firstCharacterEpisodes} showData={showData}/>
        <EpisodesList title='Character #1 & #2 - Shared Episodes' episodes={repeatedEpisodes} showData={showData}/>
        <EpisodesList title='Character #2 - Only Episodes' episodes={secondCharacterEpisodes} showData={showData}/>
    </div>
  );
}

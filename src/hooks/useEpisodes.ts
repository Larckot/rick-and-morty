import { useQuery } from '@tanstack/react-query';
import { getEpisodesByIds } from '@/utils/api';
import { Episode } from '@/utils/types';

export function useEpisodes(ids: number[]) {
  return useQuery<Episode[]>({
    queryKey: ['episodes', ids],
    queryFn: () => getEpisodesByIds(ids),
    enabled: ids.length > 0,
  });
}

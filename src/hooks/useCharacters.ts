import { useInfiniteQuery } from '@tanstack/react-query';
import { getCharacters } from '@/utils/api';
import { CharactersResponse } from '@/utils/types';

export function useCharacters() {
  return useInfiniteQuery<CharactersResponse, Error, CharactersResponse, string[], number>({
    queryKey: ['characters'],
    queryFn: ({ pageParam }) => getCharacters(pageParam as number),
    getNextPageParam: (lastPage) => {
      if (lastPage.info.next) {
        const url = new URL(lastPage.info.next);
        const nextPage = url.searchParams.get('page');
        return nextPage ? parseInt(nextPage, 10) : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

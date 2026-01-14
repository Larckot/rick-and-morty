'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { useCharacters, useIntersection } from '@/hooks';
import { Character } from '@/utils/types';
import { useCharacterStore } from '@/store/useCharacterStore';
import CharacterCard from '../CharacterCard';
import styles from './CharactersList.module.css';

interface CharacterListProps {
  id: number;
}

export default function CharactersList({ id }: CharacterListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useCharacters();

  const { selectFirst, selectSecond, firstId, secondId } = useCharacterStore();

  const isFirstList = id === 1;
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridElement, setGridElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (gridRef.current) {
      setGridElement(gridRef.current);
    }
  }, []);

  const handleIntersection = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { ref: observerTarget } = useIntersection(handleIntersection, {
    threshold: 0.1,
    root: gridElement,
    rootMargin: '0px',
  });

  const handleCharacterClick = useCallback(
    (character: Character) => {
      if (isFirstList) {
        selectFirst(character);
      } else {
        selectSecond(character);
      }
    },
    [isFirstList, selectFirst, selectSecond]
  );

  const characters: Character[] = (data as { pages: { results: Character[] }[] } | undefined)?.pages?.flatMap((page) => page.results) ?? [];

  const isSameCharacter = (id: number) => {
    const selectedCharacterId = isFirstList ? firstId : secondId;

    return id === selectedCharacterId;
  }

  const isSelectedInOtherList = (id: number) => {
    const selectedCharacterId = isFirstList ? secondId : firstId;

    return id === selectedCharacterId;
  } 

  if (isLoading) {
    return (
      <div className={styles.list}>
        <div className={styles.loading}>Loading characters...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.list}>
        <div className={styles.error}>
          Error to load characters: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Character #{id}</h2>
      <div ref={gridRef} className={styles.grid}>
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onClick={() => handleCharacterClick(character)}
            isDisabled={isSelectedInOtherList(character.id)}
            isSelected={isSameCharacter(character.id)}
          />
        ))}
        
        <div ref={observerTarget} className={styles.observer} />
        
        {isFetchingNextPage && (
          <div className={styles.loading}>Loading more characters...</div>
        )}
      </div>
      
      {characters.length === 0 && (
        <div className={styles.endMessage}>
          No characters to show
        </div>
      )}
    </div>
  );
}

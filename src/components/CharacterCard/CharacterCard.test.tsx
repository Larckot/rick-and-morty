import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CharacterCard from './index';
import { Character } from '@/utils/types';

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('CharacterCard', () => {
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

  it('should render character information correctly', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        isSelected={false}
        isDisabled={false}
      />
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();
    expect(screen.getByText('Human Male')).toBeInTheDocument();
    expect(screen.getByAltText('Rick Sanchez')).toBeInTheDocument();
  });

  it('should call onClick when clicked and not disabled', () => {
    const handleClick = vi.fn();

    render(
      <CharacterCard
        character={mockCharacter}
        onClick={handleClick}
        isSelected={false}
        isDisabled={false}
      />
    );

    const card = screen.getByText('Rick Sanchez').closest('div');
    card?.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();

    render(
      <CharacterCard
        character={mockCharacter}
        onClick={handleClick}
        isSelected={false}
        isDisabled={true}
      />
    );

    const card = screen.getByText('Rick Sanchez').closest('div');
    card?.click();

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply selected class when isSelected is true', () => {
    const { container } = render(
      <CharacterCard
        character={mockCharacter}
        isSelected={true}
        isDisabled={false}
      />
    );

    const card = container.querySelector('[class*="card"]');
    expect(card?.className).toContain('selected');
  });

  it('should apply disabled class when isDisabled is true', () => {
    const { container } = render(
      <CharacterCard
        character={mockCharacter}
        isSelected={false}
        isDisabled={true}
      />
    );

    const card = container.querySelector('[class*="card"]');
    expect(card?.className).toContain('disabled');
  });

  it('should display correct status for different statuses', () => {
    const deadCharacter: Character = {
      ...mockCharacter,
      status: 'Dead',
    };

    const { rerender } = render(
      <CharacterCard
        character={deadCharacter}
        isSelected={false}
        isDisabled={false}
      />
    );

    expect(screen.getByText('Dead')).toBeInTheDocument();

    const unknownCharacter: Character = {
      ...mockCharacter,
      status: 'unknown',
    };

    rerender(
      <CharacterCard
        character={unknownCharacter}
        isSelected={false}
        isDisabled={false}
      />
    );

    expect(screen.getByText('unknown')).toBeInTheDocument();
  });
});

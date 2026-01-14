import { Character } from '@/utils/types';
import styles from './CharacterCard.module.css';
import classNames from 'classnames';
import Image from 'next/image';

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
  isSelected: boolean;
  isDisabled: boolean;
}

export default function CharacterCard({ character, onClick, isSelected, isDisabled }: CharacterCardProps) {
  const {name, status, species, gender, image} = character;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return styles.statusAlive;
      case 'dead':
        return styles.statusDead;
      default:
        return styles.statusUnknown;
    }
  };

  const handleOnClick = () => {
    if (isDisabled) return null;

    return onClick && onClick();
    
  }

  const cardStyles = classNames(styles.card, {
    [styles.selected]: isSelected,
    [styles.disabled]: isDisabled

  })

  return (
    <div className={cardStyles} onClick={handleOnClick}>
      <div className={styles.imageContainer}>
        <Image 
          src={image} 
          alt={name}
          className={styles.image}
          fill
        />
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{name}</h3>
          <span className={`${styles.status} ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        <span className={styles.info}>{species} {gender}</span>
      </div>
    </div>
  );
}

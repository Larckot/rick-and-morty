import CharactersList from "@/components/CharactersList";
import EpisodesResult from "@/components/EpisodesResult";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <CharactersList id={1} />
        <CharactersList id={2} />
      </main>
      <EpisodesResult />
    </div>
  );
}

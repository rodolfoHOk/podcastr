import '../styles/global.scss';
import { Header } from '../components/Header';
import { Player } from '../components/Player';
import styles from '../styles/app.module.scss';
import React from 'react';
import { PlayerContextProvider } from '../contexts/PlayerContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

function MyApp({ Component, pageProps }) {
  const { isDarkTheme } = useTheme();

  return (
    <ThemeProvider>
      <PlayerContextProvider>
        <div className={styles.wrapper}>
          <main>
            <Header />
            <Component {...pageProps} />
          </main>
          <Player />
        </div>
      </PlayerContextProvider>
    </ThemeProvider>
  );
}

export default MyApp

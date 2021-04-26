import styles from './styles.module.scss';
import { FaMoon, FaSun } from 'react-icons/fa';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { useTheme } from '../../contexts/ThemeContext';

export function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {locale: ptBR});

  const { isDarkTheme, setTheme } = useTheme();

  return(
    <header 
      className={isDarkTheme ? `${styles.headerContainer} ${styles.dark}` : styles.headerContainer}
    >
      <img src='/logo.svg' alt="Podcastr" />
      <p>O melhor para você ouvir, sempre</p>
      <span>{currentDate}</span>
      <button onClick={() => isDarkTheme ? setTheme('theme-light') : setTheme('theme-dark')}>
        { isDarkTheme ? <FaSun/> : <FaMoon/> }
      </button>
    </header>
  );
}

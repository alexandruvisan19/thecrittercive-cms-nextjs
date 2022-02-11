import Container from 'components/Container';

import styles from './Header.module.scss';

const Header = ({ children }) => {
  return (
    <header className={`${styles.header} ${styles.area}`}>
      <ul className={styles.circles}>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <Container>{children}</Container>
    </header>
  );
};

export default Header;

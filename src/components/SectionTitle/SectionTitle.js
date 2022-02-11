import styles from './SectionTitle.module.scss';

const SectionTitle = ({ children }) => {
  return <h3 className={styles.sectionTitle}>{children}</h3>;
};

export default SectionTitle;

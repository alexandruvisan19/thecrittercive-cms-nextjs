import ContainerPost from 'components/ContainerPost';

import styles from './HeaderPost.module.scss';

const HeaderPost = ({ children }) => {
  return (
    <header className={styles.headerPost}>
      <ContainerPost>{children}</ContainerPost>
    </header>
  );
};

export default HeaderPost;

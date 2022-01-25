import ClassName from 'models/classname';

import styles from './ContainerPost.module.scss';

const ContainerPost = ({ children, className }) => {
  const containerPostClassName = new ClassName(styles.containerPost);

  containerPostClassName.addIf(className, className);

  return <div className={containerPostClassName.toString()}>{children}</div>;
};

export default ContainerPost;

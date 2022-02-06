import ClassName from 'models/classname';

import styles from './ContentPost.module.scss';

const Content = ({ children, className }) => {
  const contentClassName = new ClassName(styles.contentPost);

  contentClassName.addIf(className, className);

  return <div className={contentClassName.toString()}>{children}</div>;
};

export default Content;

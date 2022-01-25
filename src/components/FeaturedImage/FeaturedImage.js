import ClassName from 'models/classname';

import Image from 'components/ImagePost';

import styles from './FeaturedImage.module.scss';

const FeaturedImage = ({ className, sticky, ...rest }) => {
  const featuredImageClassName = new ClassName(styles.featuredImage);
  featuredImageClassName.addIf(className, className);

  return <Image className={featuredImageClassName} sticky={sticky} {...rest} />;
};

export default FeaturedImage;

import ClassName from 'models/classname';

import styles from './Image.module.scss';
import Image from 'next/image';

const ImagePost = ({
  children,
  className,
  width = '1200',
  height = '630',
  src,
  altText,
  srcSet,
  dangerouslySetInnerHTML,
  sticky,
}) => {
  const imageClassName = new ClassName(styles.image);
  imageClassName.addIf(className, className);
  return (
    <>
      <figure className={imageClassName.toString()}>
        <div className={styles.featuredImageImg}>
          {sticky ? (
            <Image
              width={width}
              height={height}
              src={src}
              alt={altText || ''}
              srcSet={srcSet}
              loading="eager"
              layout="intrinsic"
            />
          ) : (
            <Image
              width={width}
              height={height}
              src={src}
              alt={altText || ''}
              srcSet={srcSet}
              layout="intrinsic"
              loading="eager"
            />
          )}
        </div>
        {children && <figcaption>{children}</figcaption>}
        {dangerouslySetInnerHTML && (
          <figcaption
            dangerouslySetInnerHTML={{
              __html: dangerouslySetInnerHTML,
            }}
          />
        )}
      </figure>
    </>
  );
};

export default ImagePost;

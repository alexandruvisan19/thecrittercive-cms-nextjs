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
  sizes,
  dangerouslySetInnerHTML,
  sticky,
}) => {
  const imageClassName = new ClassName(styles.image);
  imageClassName.addIf(className, className);
  return (
    <figure className={imageClassName.toString()}>
      <div className={styles.featuredImageImg}>
        {sticky ? (
          <Image
            width={width}
            height={height}
            src={src}
            alt={altText || ''}
            srcSet={srcSet}
            sizes={sizes}
            priority={true}
            loading="eager"
          />
        ) : (
          <Image width={width} height={height} src={src} alt={altText || ''} srcSet={srcSet} sizes={sizes} />
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
  );
};

export default ImagePost;

import Link from 'next/link';

import { authorPathByName } from 'lib/users';
import ClassName from 'models/classname';

import styles from './Author.module.scss';

const Author = ({ className, author }) => {
  const metadataClassName = new ClassName(styles.author);
  const authorClassName = new ClassName(styles.authorCardContent);

  metadataClassName.addIf(className, className);
  authorClassName.addIf(className, className);

  return (
    <div className={styles.authorCardContent}>
      {author && (
        <span className={styles.author}>
          <address>
            {author.avatar && (
              <img
                width={author.avatar.width}
                height={author.avatar.height}
                src={author.avatar.url}
                alt="Author Avatar"
              />
            )}
            By{' '}
            <Link href={authorPathByName(author.name)}>
              <a rel="author">{author.name}</a>
            </Link>
          </address>
        </span>
      )}
    </div>
  );
};

export default Author;

import Link from 'next/link';

import { authorPathByName } from 'lib/users';
import ClassName from 'models/classname';
import { formatDate } from 'lib/datetime';

import styles from './Author.module.scss';

const Author = ({ className, author, date }) => {
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
            <i>by</i>{' '}
            <Link href={authorPathByName(author.name)}>
              <a rel="author">{author.name}</a>
            </Link>
            <span>&nbsp; | &nbsp;</span>
            {date && (
              <span className={styles.metadataDate}>
                <time pubdate="pubdate" dateTime={date}>
                  {formatDate(date)}
                </time>
              </span>
            )}
          </address>
        </span>
      )}
    </div>
  );
};

export default Author;

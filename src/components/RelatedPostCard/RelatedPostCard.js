import Link from 'next/link';

import { postPathBySlug } from 'lib/posts';

import styles from './RelatedPostCard.module.scss';
import FeaturedImage from 'components/FeaturedImage';

const PostCard = ({ post, options = {} }) => {
  const { title, slug, date, categories, featuredImage } = post;
  const { excludeMetadata = [] } = options;

  const metadata = {};

  if (!excludeMetadata.includes('date')) {
    metadata.date = date;
  }

  if (!excludeMetadata.includes('categories')) {
    metadata.categories = categories;
  }

  let postCardStyle = styles.postCard;

  return (
    <div className={postCardStyle}>
      {featuredImage && (
        <div>
          <Link href={postPathBySlug(slug)}>
            <a aria-label={title}>
              <FeaturedImage
                {...featuredImage}
                src={featuredImage.sourceUrl}
                dangerouslySetInnerHTML={featuredImage.caption}
              />
            </a>
          </Link>
        </div>
      )}
      <div>
        <Link href={postPathBySlug(slug)}>
          <a>
            <h3
              className={styles.postCardTitle}
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;

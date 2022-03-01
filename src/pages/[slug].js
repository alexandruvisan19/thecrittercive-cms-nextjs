import Link from 'next/link';
import { Helmet } from 'react-helmet';

// import { useEffect } from 'react';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
import React from 'react';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import parameterize from 'parameterize';
import { visit } from 'unist-util-visit';

import { getPostBySlug, getAllPosts, getRelatedPosts, sanitizeExcerpt } from 'lib/posts';
import { categoryPathBySlug } from 'lib/categories';
import { formatDate } from 'lib/datetime';
import { ArticleJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import useSite from 'hooks/use-site';
import usePageMetadata from 'hooks/use-page-metadata';
import { useScrollIndicator } from 'hooks/react-use-scroll-indicator.ts';

import Layout from 'components/Layout';
import HeaderPost from 'components/HeaderPost';
import Section from 'components/Section';
import Container from 'components/Container';
// import RelatedPostCard from 'components/RelatedPostCard';
// import Content from 'components/Content';
import ContentPost from '../components/ContentPost';
import Metadata from 'components/Metadata';
import Author from 'components/Author';
import FeaturedImage from 'components/FeaturedImage';
import dynamic from 'next/dynamic';

const RelatedPostCard = dynamic(() => import('components/RelatedPostCard'));

import styles from 'styles/pages/Post.module.scss';

export default function Post({ post, socialImage, relatedPosts }) {
  // useEffect(() => {
  //   AOS.init({
  //     easing: 'ease-out-cubic',
  //     once: false,
  //     offset: 250,
  //   });
  // }, []);
  const toc = [];

  const content = unified()
    .use(rehypeParse, {
      fragment: true,
    })
    .use(() => {
      return (tree) => {
        visit(tree, 'element', (node) => {
          if (node.tagName === 'h2') {
            const id = parameterize(node.children[0].value);
            node.properties.id = id;
            node.properties.class = node.properties.class ? `${node.properties.class} ${styles.header}` : styles.header;

            toc.push({
              id,
              title: node.children[0].value,
            });
          } else if (node.tagName === 'img' && node.properties.src.includes('amazon')) {
            node.properties.loading = 'lazy';
            node.properties.alt = 'amazon product';
            node.properties.width = '500';
            node.properties.height = '100%';
          } else if (node.tagName === 'img' && node.properties.src.includes('chewy')) {
            node.properties.loading = 'lazy';
            node.properties.alt = 'chewy product';
            node.properties.width = '500';
            node.properties.height = '100%';
          }
        });
      };
    })
    .use(rehypeStringify)
    .processSync(post.content)
    .toString();

  const [state] = useScrollIndicator();
  const { title, metaTitle, description, date, author, categories, modified, featuredImage, excerpt } = post;

  const { metadata: siteMetadata = {}, homepage } = useSite();

  if (!post.og) {
    post.og = {};
  }

  post.og.imageUrl = `${homepage}${socialImage}`;
  post.og.imageSecureUrl = post.og.imageUrl;
  post.og.imageWidth = 2000;
  post.og.imageHeight = 1000;

  const { metadata } = usePageMetadata({
    metadata: {
      ...post,
      title: metaTitle,
      description: description || post.og?.description || `Read more about ${title}`,
    },
  });

  if (process.env.WORDPRESS_PLUGIN_SEO !== true) {
    metadata.title = `${title} - ${siteMetadata.title}`;
    metadata.og.title = metadata.title;
    metadata.twitter.title = metadata.title;
  }

  const metadataOptions = {
    compactCategories: false,
  };

  const { posts: relatedPostsList, title: relatedPostsTitle } = relatedPosts;

  const helmetSettings = helmetSettingsFromMetadata(metadata);

  return (
    <Layout procentScroll={state}>
      <Helmet {...helmetSettings} />

      <ArticleJsonLd post={post} siteTitle={siteMetadata.title} />

      <HeaderPost>
        <div>
          <Metadata className={styles.postMetadata} categories={categories} options={metadataOptions} />
          <h1
            className={styles.title}
            dangerouslySetInnerHTML={{
              __html: title,
            }}
          />
          <div className={styles.metadataWrapper}>
            <Author className={styles.postCardMetadata} author={author} date={date} />
          </div>
          <p id={styles.affiliateDisclosure}>
            TheCritterCove is reader-supported. When you buy via links on our site, we may earn an affiliate commission
            at no cost to you.{' '}
            <Link href="/page/affiliate-disclaimer-and-review-policy/">
              <a>See more here</a>
            </Link>
            .
          </p>
          {featuredImage && (
            <FeaturedImage
              {...featuredImage}
              src={featuredImage.sourceUrl}
              dangerouslySetInnerHTML={featuredImage.caption}
            />
          )}
          {excerpt && (
            <div
              className={styles.postCardContent}
              dangerouslySetInnerHTML={{
                __html: sanitizeExcerpt(excerpt),
              }}
            />
          )}
        </div>
      </HeaderPost>

      <ContentPost>
        <aside>
          <div className={styles.stickybox}>
            <div className={styles.articleStructure}>
              <p className={styles.tableOfContent}>Table of Contents 📑</p>
              <ul>
                {toc.map(({ id, title }) => {
                  return (
                    <li key={id}>
                      <a href={`#${id}`}>{title}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
        <Container>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </Container>
      </ContentPost>

      <Section className={styles.postFooter}>
        <Container>
          <p className={styles.postModified}>Last updated on {formatDate(modified)}.</p>
          {!!relatedPostsList.length && (
            <div className={styles.relatedPosts}>
              {relatedPostsTitle.name ? (
                <span>
                  More from{' '}
                  <Link href={relatedPostsTitle.link}>
                    <a>{relatedPostsTitle.name}</a>
                  </Link>
                </span>
              ) : (
                <span>More Posts</span>
              )}
              {relatedPosts.posts.length >= 3 && (
                <ul className={styles.posts}>
                  {relatedPostsList.map((post) => {
                    return (
                      <li key={post.slug}>
                        <RelatedPostCard post={post} />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  const { post } = await getPostBySlug(params?.slug);

  const socialImage = `${process.env.OG_IMAGE_DIRECTORY}/${params?.slug}.png`;

  const { categories, databaseId: postId } = post;
  const category = categories.length && categories[0];
  let { name, slug } = category;

  return {
    props: {
      post,
      socialImage,
      relatedPosts: {
        posts: await getRelatedPosts(category, postId),
        title: {
          name: name || null,
          link: categoryPathBySlug(slug),
        },
      },
    },
  };
}

export async function getStaticPaths() {
  const { posts } = await getAllPosts();

  const paths = posts
    .filter(({ slug }) => typeof slug === 'string')
    .map(({ slug }) => ({
      params: {
        slug,
      },
    }));

  return {
    paths,
    fallback: false,
  };
}

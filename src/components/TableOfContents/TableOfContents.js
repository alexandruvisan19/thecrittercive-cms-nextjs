import styles from './TableOfContents.module.scss';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import parameterize from 'parameterize';

const TableOfContents = ({ post }) => {
  const toc = [];
  unified()
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
            node.properties.style = 'padding-top: 90px; margin-top: -60px';

            toc.push({
              id,
              title: node.children[0].value,
            });

            node.children.unshift({
              type: 'element',
              tagName: 'a',
              properties: {
                href: `#${id}`,
                class: styles.anchor,
                'aria-hidden': 'true',
              },
            });
          }
        });
      };
    })
    .use(rehypeStringify)
    .processSync(post.content)
    .toString();

  return (
    <div className={styles.articleStructure}>
      <p className={styles.tableOfContent}>Inside this article 📑</p>
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
  );
};

export default TableOfContents;

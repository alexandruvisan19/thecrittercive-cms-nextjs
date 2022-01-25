import { Helmet } from 'react-helmet';

import useSite from 'hooks/use-site';
import { getAllCategories } from 'lib/categories';
import { WebpageJsonLd } from 'lib/json-ld';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import Category from '../components/Category';

export default function Categories({ categories }) {
  const { metadata = {} } = useSite();
  const { title: siteTitle } = metadata;
  const title = 'Categories';
  const slug = 'categories';
  let metaDescription = `Read ${categories.length} categories at ${siteTitle}.`;

  return (
    <Layout>
      <Helmet>
        <title>Categories</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
      </Helmet>

      <WebpageJsonLd title={title} description={metaDescription} siteTitle={siteTitle} slug={slug} />

      <Header>
        <Container>
          <h1>Categories</h1>
        </Container>
      </Header>

      <Section>
        <Container>
          <Category
            color="#EDF0FC"
            categories={categories}
            title="Turtle Care"
            link="/categories/turtle-care/"
            id="15"
          />
        </Container>
        <Container>
          <Category
            color="#EFF9EE"
            categories={categories}
            title="Tortoise Care"
            link="/categories/tortoise-care/"
            id="30"
          />
        </Container>
        {/* <Container>
          <Category categories={categories} title="Reptile Care" link="/categories/reptile-care/" id="41" />
        </Container> */}
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  const { categories } = await getAllCategories();

  return {
    props: {
      categories,
    },
  };
}

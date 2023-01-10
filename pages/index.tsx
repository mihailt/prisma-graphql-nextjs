import { gql, useQuery } from '@apollo/client';
import { InView } from 'react-intersection-observer';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Card from '../components/card';
import Header from '../components/header';

export default function Home() {
  const allPostsQuery = gql`
    query Query($limit: Int!, $cursor: String) {
      posts(limit: $limit, cursor: $cursor) {
        id
        imageUrl
        title
        url
        user {
          id
          email
          image
        }
        description
      }
    }
  `;
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);

  const {
    data, loading, error, fetchMore,
  } = useQuery(allPostsQuery, {
    variables: { limit: 10 },
  });

  const postQueryHandler = (responseData: any) => {
    if (responseData && responseData.posts) {
      if (responseData.posts.length === 0) {
        setHasMore(false);
      }
      setPosts([...posts, ...responseData.posts]);
    }
  };

  useEffect(() => {
    postQueryHandler(data);
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    return (
      <p>
        Oh no...
        {error.message}
      </p>
    );
  }

  const onShouldLoadMore = async (inView: any) => {
    const cursor = posts.length > 0
      ? posts[posts.length - 1].id
      : null;

    if (inView && hasMore) {
      const res = await fetchMore({
        variables: {
          cursor,
          limit: 10,
        },
      });
      postQueryHandler(res.data);
    }
  };

  return (
    <>
      <Head>
        <title>Prisma, Graphql, Next.js App</title>
        <meta name="description" content="Prisma, Graphql, Next.js App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <div className="container mx-auto max-w-5xl my-20 px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts && posts.map((post) => (
              <Link href={`/link/${post.id}`} key={post.id}>
                <a href="#!">
                  <Card
                    title={post.title}
                    url={post.url}
                    id={post.id}
                    description={post.description}
                    imageUrl={post.imageUrl}
                  />
                </a>
              </Link>
            ))}
            {posts && (
              <InView
                onChange={onShouldLoadMore}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}

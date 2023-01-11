import { gql, useQuery } from '@apollo/client';
import { InView } from 'react-intersection-observer';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Card from '../components/card';

export default function Favorites() {
  const favoritesPostsQuery = gql`
    query Post($limit: Int!, $cursor: String) {
      favorites(limit: $limit, cursor: $cursor) {
        id
        title
        description
        image {
          id
          mimetype
          url
        }
        user {
          email
          id
          image
        }
      }
    }
  `;
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);

  const {
    data, loading, error, fetchMore,
  } = useQuery(favoritesPostsQuery, {
    variables: { limit: 10 },
    fetchPolicy: 'cache-and-network',
  });

  const postQueryHandler = (responseData: any) => {
    if (responseData && responseData.favorites) {
      if (responseData.favorites.length === 0) {
        setHasMore(false);
      }
      setPosts([...posts, ...responseData.favorites]);
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {posts && posts.map((post) => (
        <Link href={`/post/${post.id}`} key={post.id}>
          <a href="#!">
            <Card
              title={post.title}
              id={post.id}
              description={post.description}
              imageUrl={post.image.url}
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
  );
}

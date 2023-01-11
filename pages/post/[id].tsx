import { gql, useMutation, useQuery } from '@apollo/client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Post() {
  const postQuery = gql`
    query Post($id: String!) {
      post(id: $id) {
        id
        description
        image {
          id
          mimetype
          url
        }
        title
        user {
          email
          id
          image
        }
      }
    }
  `;

  const bookmarkPostMutation = gql`
    mutation Bookmark($id: String) {
      bookmark(id: $id) {
        description
        id
        image {
          id
          mimetype
          url
        }
        title
        user {
          email
          id
          image
        }
      }
    }
`;

  const router = useRouter();
  const { user } = useUser();
  const { id } = router.query;
  const {
    data, loading, error,
  } = useQuery(postQuery, {
    variables: { id },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [createBookmark] = useMutation(bookmarkPostMutation);

  const bookmark = async () => {
    setIsLoading(true);
    toast.promise(createBookmark({ variables: { id } }), {
      loading: 'working on it',
      success: 'Saved successfully! 🎉',
      error: 'Something went wrong 😥 Please try again',
    });
    setIsLoading(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    return (
      <p>
        Oh no...
        {error.message}
      </p>
    );
  }

  return (
    <div className="prose container mx-auto px-8">
      <Toaster />
      <h1>{data.post.title}</h1>
      <img src={data.post.image.url} className="shadow-lg rounded-lg" />
      <p>{data.post.description}</p>
      {user && (
      <button
        type="button"
        onClick={() => bookmark()}
        className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="w-6 h-6 animate-spin mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
            </svg>
            Saving...
          </span>
        ) : (
          <span>Bookmark</span>
        )}
      </button>
      )}
    </div>
  );
}

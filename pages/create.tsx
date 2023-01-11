import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { gql, useMutation } from '@apollo/client';

export default function Create() {
  const CreatePostMutation = gql`
    mutation Mutation($title: String, $description: String, $imageId: String) {
      create(title: $title, description: $description, imageId: $imageId) {
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
  const [createPost, { loading }] = useMutation(CreatePostMutation);
  const [imageLoading, setImageLoading] = useState(false);

  const [imageId, setImageId] = useState('');
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    // eslint-disable-next-line no-mixed-operators
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  const uploadPostImage = async (e: any) => {
    const file = e.target.files[0];
    const filename = `${encodeURIComponent(uuid())}${encodeURIComponent(file.name)}`;
    const rFile = new File([file], filename, { type: file.type });

    const res = await fetch(`/api/upload?file=${filename}`);
    const json = await res.json();
    const formData = new FormData();
    setImageId(json.file.id);

    Object.entries({ ...json.url.fields, file: rFile }).forEach(([key, value]) => {
      // @ts-ignore: force casting here
      formData.append(key, value);
    });
    setImageLoading(true);
    await toast.promise(
      fetch(json.url.url, {
        mode: 'no-cors',
        method: 'POST',
        body: formData,
      }),
      {
        loading: 'Uploading...',
        success: 'Image successfully uploaded!🎉',
        error: 'Upload failed 😥 Please try again.',
      },
    );
    setImageLoading(false);
  };

  // eslint-disable-next-line no-promise-executor-return
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const onSuccess = async (resp: any) => {
    await sleep(1000);
    router.push(`/post/${resp.data.createPost.id}`);
  };

  const onSubmit = async (values: any) => {
    const { title, description } = values;
    console.log({ title, description, imageId });
    try {
      await toast.promise(createPost({
        variables: {
          title, description, imageId,
        },
      }), {
        loading: 'Creating new post..',
        success: (value) => {
          onSuccess(value);
          return 'Post successfully created!🎉';
        },
        error: 'Something went wrong 😥 Please try again.',
      });
      reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl my-20 px-5">
      <Toaster />
      <h1 className="text-3xl font-medium my-5">Create new Post</h1>
      <form
        className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="block">
          <span className="text-gray-700">Title</span>
          <input
            {...register('title', { required: true })}
            placeholder="Title"
            name="title"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description</span>
          <textarea
            placeholder="Description"
            {...register('description', { required: true })}
            name="description"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">
            Upload a .png or .jpg image (max 10MB).
          </span>
          <br />
          <input
            {...register('image', { required: true })}
            onChange={uploadPostImage}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            name="image"
          />
        </label>

        <button
          disabled={loading || imageLoading}
          type="submit"
          className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {loading || imageLoading
            ? (
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
            ) : (<span>Create Post</span>)}
        </button>
      </form>
    </div>
  );
}

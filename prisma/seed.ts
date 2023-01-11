import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const files = [
  {
    id: '8a9020b2-363b-4a4f-ad26-d6d55b51bqe5',
    url: 'https://s3.eu-north-1.amazonaws.com/experimental-popspot/01977a11-b6c9-4ba5-b01b-c67730612c9eDonut1.m4v',
  },
  {
    id: '8a9020b2-363b-4a4f-ad26-d6d55b51bqe4',
    url: 'https://assets.vercel.com/image/upload/v1662090959/front/nextjs/twitter-card.png',
  },
  {
    id: '8a9020b2-363b-4a4f-ad26-d6d55b51bqe3',
    url: 'https://website-v8.vercel.app/og-images/og-image-prisma-index.png',
  },
  {
    id: '8a9020b2-363b-4a4f-ad26-d6d55b51bqe2',
    url: 'https://tailwindcss.com/_next/static/media/social-card-large.f6878fd8df804f73ba3f1a271122105a.jpg',
  },
  {
    id: '8a9020b2-363b-4a4f-ad26-d6d55b51bqe1',
    url: 'https://www.apollographql.com/apollo-home.jpg',
  },
];

const posts = [
  {
    id: '8a9020b2-363b-4a4f-ad26-d6d55b51bqe',
    title: 'Next.js',
    description: 'Fullstack React framework',
    imageId: '8a9020b2-363b-4a4f-ad26-d6d55b51bqe4',
  },
  {
    id: '2a3121b2-363b-4a4f-ad26-d6c35b41bade',
    title: 'Prisma',
    description: 'Next Generation ORM for TypeScript and JavaScript',
    imageId: '8a9020b2-363b-4a4f-ad26-d6d55b51bqe3',
  },
  {
    id: '6a9122b2-363b-4a4f-ad26-d6c55b51baed',
    title: 'TailwindCSS',
    description: 'Utility-fist css framework',
    imageId: '8a9020b2-363b-4a4f-ad26-d6d55b51bqe2',
  },
  {
    id: '2ea8cfb0-44a3-4c07-bdc2-31ffa135ea78',
    title: 'Apollo GraphQL',
    description: 'GraphQL implementation ',
    imageId: '8a9020b2-363b-4a4f-ad26-d6d55b51bqe1',
  },
];

async function main() {
  await prisma.user.create({
    data: {
      id: '8a9020b2-363b-4a4f-ad26-d6d55b51b444',
      email: 'mihailt@gmail.com',
      files: {
        createMany: {
          data: files,
        },
      },
      posts: {
        createMany: {
          data: posts,
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

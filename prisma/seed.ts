import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const posts = Array(100).fill(
  {
    description: 'GraphQL implementation ',
    imageUrl: 'https://www.apollographql.com/apollo-home.jpg',
    title: 'Apollo GraphQL',
    url: 'https://apollographql.com',
    userId: '',
  },
);

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'mihailt@gmail.com',
    },
  });

  posts.forEach((post) => {
    post.userId = user.id;
  });

  await prisma.post.createMany({
    data: posts,
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

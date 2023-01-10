import { Context } from '../../context';
import { User } from '../User';

export interface PostArgs {
  limit: number
  cursor?: string
  userId?: string
}

export interface Post {
  id: string
  title: string
  description: string
  url: string
  imageUrl: string
  user: User
}

const resolvers = {
  Query: {
    posts: async (_parent: undefined, args: PostArgs, ctx: Context) => {
      const posts = await ctx.prisma.post.findMany({
        skip: args.cursor ? 1 : 0,
        take: args.limit,
        cursor: args.cursor ? { id: args.cursor } : undefined,
        where: args.userId ? { userId: args.userId } : undefined,
        orderBy: {
          id: 'desc',
        },
        include: {
          user: true,
        },
      });
      return posts;
    },
  },
};

export default resolvers;

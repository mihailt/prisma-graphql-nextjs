import { Context } from '../../context';

export interface PostArgs {
  limit: number
  cursor?: string
  userId?: string
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

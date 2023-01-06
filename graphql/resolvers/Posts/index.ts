import { Context } from '../../context';

export interface PostsArgs {
  limit: number
  cursor?: string
}

const resolvers = {
  Query: {
    posts: async (_parent: undefined, args: PostsArgs, ctx: Context) => {
      const posts = await ctx.prisma.post.findMany({
        skip: args.cursor ? 1 : 0,
        take: args.limit,
        cursor: args.cursor ? { id: args.cursor } : undefined,
        orderBy: {
          id: 'desc',
        },
      });
      return posts;
    },
  },
};

export default resolvers;

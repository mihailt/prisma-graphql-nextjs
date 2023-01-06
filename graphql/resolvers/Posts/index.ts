import { Context } from '../../context';

export interface PostsArgs {
  limit: number
  offset: number
}

const resolvers = {
  Query: {
    posts: async (_parent: undefined, args: PostsArgs, ctx: Context) => {
      const posts = await ctx.prisma.post.findMany({
        skip: args.offset,
        take: args.limit,
        orderBy: {
          id: 'desc',
        },
      });
      return posts;
    },
  },
};

export default resolvers;

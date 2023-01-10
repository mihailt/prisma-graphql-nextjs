import { Context } from '../../context';

export interface UserArgs {
  id: string
}

export interface User {
  id: string
  email: string
  image: String
}

const resolvers = {
  Query: {
    user: async (_parent: undefined, args: UserArgs, ctx: Context) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: args.id,
        },
      });

      return user;
    },
  },
};

export default resolvers;

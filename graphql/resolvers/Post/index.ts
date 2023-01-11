import { Context } from '../../context';
import { User } from '../User';

export interface PostsArgs {
  limit: number
  cursor?: string
  userId?: string
}

export interface BookmarkPostArgs {
  id: string
}

export interface CreatePostArgs {
  title: string
  description: string
  imageId: string
}

export interface MyPostsArgs {
  limit: number
  cursor?: string
}

export interface FavoritesPostsArgs {
  limit: number
  cursor?: string
}

export interface PostArgs {
  id: string
}

export interface Post {
  id: string
  title: string
  description: string
  user: User
}

const resolvers = {
  Query: {
    posts: async (_parent: undefined, args: PostsArgs, ctx: Context) => {
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
          image: true,
        },
      });
      return posts;
    },

    favorites: async (_parent: undefined, args: FavoritesPostsArgs, ctx: Context) => {
      if (!ctx.user) {
        throw new Error('You do not have permission to perform action');
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.user.email,
        },
        include: {
          favorites: {
            skip: args.cursor ? 1 : 0,
            take: args.limit,
            cursor: args.cursor ? { id: args.cursor } : undefined,
            include: {
              user: true,
              image: true,
            },
            orderBy: {
              id: 'desc',
            },
          },
        },
      });
      if (!user) {
        throw new Error('You do not have permission to perform action');
      }
      return user.favorites;
    },

    my: async (_parent: undefined, args: MyPostsArgs, ctx: Context) => {
      if (!ctx.user) {
        throw new Error('You do not have permission to perform action');
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.user.email,
        },
      });

      if (!user) {
        throw new Error('You do not have permission to perform action');
      }

      const posts = await ctx.prisma.post.findMany({
        skip: args.cursor ? 1 : 0,
        take: args.limit,
        cursor: args.cursor ? { id: args.cursor } : undefined,
        where: { userId: user.id },
        orderBy: {
          id: 'desc',
        },
        include: {
          user: true,
          image: true,
        },
      });
      return posts;
    },

    post: async (_parent: undefined, args: PostArgs, ctx: Context) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: args.id },
        include: {
          user: true,
          image: true,
        },
      });
      return post;
    },
  },
  Mutation: {
    create: async (_parent: undefined, args: CreatePostArgs, ctx: Context) => {
      if (!ctx.user) {
        throw new Error('You do not have permission to perform action');
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.user.email,
        },
      });

      if (!user) {
        throw new Error('You do not have permission to perform action');
      }

      const data = {
        title: args.title,
        description: args.description,
        imageId: args.imageId,
        userId: user.id,
      };

      const post = await ctx.prisma.post.create({ data });

      await ctx.prisma.user.update({
        where: {
          email: ctx.user.email,
        },
        data: {
          posts: {
            connect: {
              id: post.id,
            },
          },
        },
      });

      return ctx.prisma.post.findUnique({
        where: {
          id: post.id,
        },
        include: {
          image: true,
          user: true,
        },
      });
    },
    bookmark: async (_parent: undefined, args: BookmarkPostArgs, ctx: Context) => {
      if (!ctx.user) {
        throw new Error('You do not have permission to perform action');
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.user.email,
        },
      });

      if (!user) {
        throw new Error('You do not have permission to perform action');
      }

      const post = await ctx.prisma.post.findUnique({
        where: {
          id: args.id,
        },
      });

      if (!post) {
        throw new Error('Cannot find post');
      }

      await ctx.prisma.user.update({
        where: {
          email: ctx.user.email,
        },
        data: {
          favorites: {
            connect: {
              id: post.id,
            },
          },
        },
      });

      await ctx.prisma.post.update({
        where: {
          id: args.id,
        },
        data: {
          favorites: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return ctx.prisma.post.findUnique({
        where: {
          id: args.id,
        },
        include: {
          image: true,
          user: true,
        },
      });
    },
  },
};

export default resolvers;

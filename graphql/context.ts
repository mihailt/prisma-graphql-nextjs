import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { Claims, getSession } from '@auth0/nextjs-auth0';
import prisma from '../lib/prisma';

export type Context = {
  user?: Claims;
  accessToken?: string;
  prisma: PrismaClient;
  req: NextApiRequest,
  res: NextApiResponse
};

export async function createContext(req: NextApiRequest, res: NextApiResponse): Promise<Context> {
  const session = await getSession(req, res);
  if (!session) {
    return {
      prisma,
      req,
      res,
    };
  }

  const user = session?.user;
  const accessToken = session?.accessToken;

  return {
    user,
    accessToken,
    prisma,
    req,
    res,
  };
}

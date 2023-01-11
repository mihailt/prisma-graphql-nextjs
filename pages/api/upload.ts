import aws from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import { createContext } from '../../graphql/context';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ctx = await createContext(req, res);
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: ctx.user?.email,
      },
    });

    const s3 = new aws.S3({
      accessKeyId: process.env.APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.APP_AWS_SECRET_KEY,
      region: process.env.APP_AWS_REGION,
    });

    aws.config.update({
      accessKeyId: process.env.APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.APP_AWS_SECRET_KEY,
      region: process.env.APP_AWS_REGION,
      signatureVersion: 'v4',
    });

    const post = await s3.createPresignedPost({
      Bucket: process.env.APP_AWS_S3_BUCKET_NAME,
      Fields: {
        key: `${req.query.file}`,
      },
      Expires: 3600, // seconds
      Conditions: [
        ['content-length-range', 100, 10000000], // 100 bytes to 10 MB
      ],
    });
    const file = await prisma.mediaFile.create({
      data: {
        url: `${post.url}/${post.fields.key}`,
        userId: user?.id,
      },
    });

    return res.status(200).json({ url: post, file });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}

## Prisma, S3, Auth0, Graphql, Next.js project 

![Screenshot](readme/readme.png)

The complete app is running on [https://prisma-graphql-nextjs-rho.vercel.app/](https://prisma-graphql-nextjs-rho.vercel.app/) check it yourself to see the result.

This is a demo project allowing the user to sign-up/sign-up and create, view and bookmark posts.
It uses postgres for data storage, s3 for file storage, auth0 for authentication, prisma as orm, graphql as communication transport.

## Getting started

  - Rename `.env.example` to `.env` and setup required variables;
  - Use  `npx prisma db push` command to sync database according to defenitions defined in `prisma/schema.prisma`
  - Seed data using `npx prisma db seed` command (checkout `prisma/seed.ts`)
  - Auth0 is used, so custom action for login flow is needed, with code below, the action will call a hook after user is authenticated trough auth0
    ```
    const fetch = require('node-fetch')

    exports.onExecutePostLogin = async (event, api) => {
      const SECRET = event.secrets.AUTH0_HOOK_SECRET
      const URL = 'https://YOURDOMAIN/api/auth/hook'

      if (event.user.app_metadata.localUserCreated) {
        return
      }

      const email = event.user.email
      const request = await fetch(URL, { 
        method: 'post',
        body: JSON.stringify({ email, secret: SECRET }),
        headers: { 'Content-Type': 'application/json' },
      })
      const response = await request.json()
      api.user.setAppMetadata('localUserCreated', true)
    }
    ```
  - Run `yarn dev` to start development

## App Structure
 - `components/` - common ui elements
 - `graphql/`  - type defenitions and resolvers for graphql server
 - `prisma/`  - database schema defenition and seed script
 - `lib/` - common libraries
 - `pages/api/auth` - auth0 setup
 - `pages/api/graphql.ts` - graphql endpoint using apollo server
 - `pages/api/upload.ts` - s3 upload endpoint
 - `pages/index.ts` - home page 
 - `pages/create.ts` - create post page 
 - `pages/favorites.ts` - favorites page 
 - `pages/posts.ts` - my posts page 

## Graphql defenitions
```
  type Query {
    my(limit: Int!, cursor: String): [Post]
    favorites(limit: Int!, cursor: String): [Post]
    posts(limit: Int!, cursor: String, userId: String): [Post]
    post(id: String!): Post
    user(id: String!): User
  }

  type Mutation {
    create(title: String, description: String, imageId: String): Post!
    bookmark(id: String): Post!
  }

  type MediaFile {
    id: String
    mimetype: String
    url: String
  }

  type Post {
    id: ID!
    title: String!
    description: String!
    image: MediaFile
    user: User!
  }

  type User {
    id: ID!
    email: String!
    image: String
  }
  ```
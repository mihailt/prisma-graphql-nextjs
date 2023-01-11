import gql from 'graphql-tag';
import r from './resolvers';

export const typeDefs = gql`
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
`;

export const resolvers = r;

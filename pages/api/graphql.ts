import { ApolloServer } from '@apollo/server';
import { nextHandler } from 'apollo-server-nextjs';

import { typeDefs, resolvers } from '../../graphql';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default nextHandler(server);

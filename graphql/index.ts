import gql from 'graphql-tag';
import path from 'path';
import r from './resolvers';

const { readFileSync } = require('fs');

const requireGQL = (file: string) => {
  const dir = path.join(process.cwd(), 'graphql');
  const content = readFileSync(`${dir}/${file}`, 'utf8');
  return gql`${content}`;
};

export const typeDefs = requireGQL('schema.graphql');
export const resolvers = r;

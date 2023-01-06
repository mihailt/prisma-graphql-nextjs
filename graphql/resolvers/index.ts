import merge from 'lodash.merge';
import post from './Post';
import user from './User';

const resolvers = merge(
  post,
  user,
);

export default resolvers;

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo';
import Layout from '../components/layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <Layout>
          { /* eslint-disable-next-line react/jsx-props-no-spreading */ }
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </ApolloProvider>
  );
}

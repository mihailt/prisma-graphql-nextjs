import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from './header';

type LayoutProps = {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Prisma, Graphql, Next.js App</title>
        <meta name="description" content="Prisma, Graphql, Next.js App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container mx-auto max-w-5xl px-5">
          <Header />
        </div>
        <div className="container mx-auto max-w-5xl my-20 px-5">
          {children}
        </div>
      </main>
    </>
  );
}

export default Layout;

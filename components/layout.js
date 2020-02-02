import Link from 'next/link';
import Head from 'next/head';
import { StyleProvider } from 'cf-style-nextjs';
import { createComponent } from 'cf-style-container';

const Center = createComponent(({ theme }) => ({
  margin: '0px auto',
  margin: theme.space[4]
}));

export default ({ children, title = 'Minesweeper', mineCount }) => (
  <StyleProvider>
    <Center>
      <h1>{title}</h1>
      <h3>{mineCount}</h3>
      {children}
    </Center>
  </StyleProvider>
);

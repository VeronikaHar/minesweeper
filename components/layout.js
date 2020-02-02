import Link from 'next/link';
import Head from 'next/head';
import { StyleProvider } from 'cf-style-nextjs';
import { createComponent } from 'cf-style-container';

const Center = createComponent(({ theme }) => ({
  margin: '5% auto',
  padding: '25px',
  borderRadius: '5px',
  backgroundColor: "#FAF2EB",
  width: "fit-content",
  textAlign: 'center',
  color: '#4F707A',
  fontFamily: 'Slabo 27px'
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

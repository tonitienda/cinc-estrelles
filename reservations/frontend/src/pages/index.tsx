import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>The Grand Ruteho</title>
        <meta name="description" content="The Grand Cinc Estrelles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Typography variant="h1" component="h2">
          The Grand Cinc Estrelles
        </Typography>;
        <Button variant="contained" color="primary">
          Access
        </Button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home

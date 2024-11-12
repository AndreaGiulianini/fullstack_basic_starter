import Image from 'next/image'
import Counter from '../components/counter/Counter'
import styles from '../styles/Home.module.css'

async function fetchServerData() {
  const res = await fetch('http://traefik/api/healthcheck/ping') // Use traefik for server call, localhost if you find on client side
  const data = await res.json()
  return data
}

export default async function Home() {
  const data = await fetchServerData()
  console.log('server', data)

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href='https://nextjs.org'>Next.js!</a>
        </h1>
        <Counter />
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

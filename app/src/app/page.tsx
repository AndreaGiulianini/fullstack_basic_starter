import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import Counter from '../components/counter/Counter'
import styles from '../styles/Home.module.css'

async function fetchServerData() {
  try {
    const res = await fetch('http://traefik/api/healthcheck/ping', {
      cache: 'no-store'
    }) // Use traefik for server call, localhost if you find on client side

    if (!res.ok) {
      console.error(`Failed to fetch server data: ${res.status} ${res.statusText}`)
      return null
    }

    const contentType = res.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      const text = await res.text()
      console.error(`Expected JSON but got: ${text}`)
      return null
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error('Failed to fetch server data:', error)
    return null
  }
}

export default async function HomePage() {
  const t = await getTranslations('HomePage')
  const data = await fetchServerData()
  if (data) {
    console.log('server', data)
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {t('title')} <a href='https://nextjs.org'>Next.js!</a>
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

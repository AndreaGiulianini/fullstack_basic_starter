import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useTranslation } from 'react-i18next'
import Counter from '@/components/counter/Counter'
import styles from '@/styles/Home.module.css'

// Shape of GET /api/healthcheck/ping (api/utils/schemas/validation.ts:157).
// `createServerFn` validates that whatever it returns is serialisable, so this
// has to be a concrete type — `unknown` fails that check.
type HealthcheckPayload = {
  success: boolean
  message: string
}

const fetchHealthcheck = createServerFn({ method: 'GET' }).handler(async () => {
  const res = await fetch('http://traefik/api/healthcheck/ping')
  if (!res.ok) {
    return { ok: false as const, status: res.status }
  }
  const contentType = res.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return { ok: false as const, status: res.status }
  }
  return { ok: true as const, payload: (await res.json()) as HealthcheckPayload }
})

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: () => fetchHealthcheck()
})

function HomePage() {
  const { t } = useTranslation()
  const health = Route.useLoaderData()

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {t('HomePage.title')} <a href='https://tanstack.com/start'>TanStack Start!</a>
        </h1>
        <p>API health: {health.ok ? 'ok' : `down (${health.status})`}</p>
        <Counter />
      </main>

      <footer className={styles.footer}>
        <a href='https://tanstack.com' target='_blank' rel='noopener noreferrer'>
          Powered by{' '}
          <span className={styles.logo}>
            <img src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

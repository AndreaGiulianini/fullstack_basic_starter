/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import '@/i18n'
import { reduxStore } from '@/redux/store'
import appCss from '@/styles/globals.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Fullstack Basic Starter' },
      { name: 'description', content: 'TanStack Start frontend starter' }
    ],
    links: [{ rel: 'stylesheet', href: appCss }]
  }),
  component: RootComponent
})

function RootComponent() {
  return (
    <RootDocument>
      <ReduxProvider store={reduxStore}>
        <Outlet />
      </ReduxProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <HeadContent />
      </head>
      <body className='antialiased'>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

'use client'

import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { reduxStore } from '../redux/store'

export default function Providers({ children }: { children: ReactNode }) {
  return <Provider store={reduxStore}>{children}</Provider>
}

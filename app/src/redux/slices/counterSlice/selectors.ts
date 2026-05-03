import type { ReduxState } from '@/redux/store'

export const selectCount = (state: ReduxState) => state.counter.value

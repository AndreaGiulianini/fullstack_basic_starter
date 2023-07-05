/* Core */
import { type Action, type ConfigureStoreOptions, type ThunkAction, configureStore } from '@reduxjs/toolkit'
import {
  type TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux'

/* Instruments */
import { reducer } from './rootReducer'

const configreStoreDefaultOptions: ConfigureStoreOptions = { reducer }

export const makeReduxStore = (options: ConfigureStoreOptions = configreStoreDefaultOptions) => {
  const store = configureStore(options)

  return store
}

export const reduxStore = configureStore({
  reducer,
})
export const useDispatch = () => useReduxDispatch<ReduxDispatch>()
export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector

/* Types */
export type ReduxStore = typeof reduxStore
export type ReduxState = ReturnType<typeof reduxStore.getState>
export type ReduxDispatch = typeof reduxStore.dispatch
export type ReduxThunkAction<ReturnType = void> = ThunkAction<ReturnType, ReduxState, unknown, Action>

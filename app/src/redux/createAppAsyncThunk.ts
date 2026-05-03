import { createAsyncThunk } from '@reduxjs/toolkit'
import type { ReduxDispatch, ReduxState } from '@/redux/store'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: ReduxState
  dispatch: ReduxDispatch
  rejectValue: string
}>()

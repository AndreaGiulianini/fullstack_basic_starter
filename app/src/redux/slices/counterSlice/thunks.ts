import { createAppAsyncThunk } from '@/redux/createAppAsyncThunk'
import type { ReduxThunkAction } from '@/redux/store'
import { counterSlice } from './counterSlice'
import { fetchIdentityCount } from './fetchIdentityCount'
import { selectCount } from './selectors'

export const incrementAsync = createAppAsyncThunk('counter/fetchIdentityCount', async (amount: number) => {
  const response = await fetchIdentityCount(amount)
  return response.amount
})

export const incrementIfOddAsync =
  (amount: number): ReduxThunkAction =>
  (dispatch, getState) => {
    const currentValue = selectCount(getState())
    if (currentValue % 2 === 1) {
      dispatch(counterSlice.actions.incrementByAmount(amount))
    }
  }

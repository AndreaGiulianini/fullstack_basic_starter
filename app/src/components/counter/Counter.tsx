import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { counterSlice, incrementAsync, incrementIfOddAsync, selectCount } from '../../../redux/slices/index'
import { Button } from '../Button'
import styles from './counter.module.css'

function Counter() {
  const dispatch = useDispatch()
  const count = useSelector(selectCount)
  const [incrementAmount, setIncrementAmount] = useState(2)

  return (
    <div>
      <div className={styles.row}>
        <Button aria-label='Decrement value' onClick={() => dispatch(counterSlice.actions.decrement())}>
          -
        </Button>

        <span className={styles.value}>{count}</span>

        <Button aria-label='Increment value' onClick={() => dispatch(counterSlice.actions.increment())}>
          +
        </Button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label='Set increment amount'
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(Number(e.target.value ?? 0))}
        />
        <Button onClick={() => dispatch(counterSlice.actions.incrementByAmount(incrementAmount))}>Add Amount</Button>
        <Button onClick={() => dispatch(incrementAsync(incrementAmount))}>Add Async</Button>
        <Button onClick={() => dispatch(incrementIfOddAsync(incrementAmount))}>Add if odd</Button>
      </div>
    </div>
  )
}

export default Counter

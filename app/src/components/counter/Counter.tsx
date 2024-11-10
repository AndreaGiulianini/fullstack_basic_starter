import { useState } from 'react'

/* Instruments */
import { counterSlice, incrementAsync, incrementIfOddAsync, selectCount,  } from '../../../redux/slices/index'
import { useDispatch, useSelector } from 'react-redux'
import styles from './counter.module.css'

function Counter() {
  const dispatch = useDispatch()
  const count = useSelector(selectCount)
  const [incrementAmount, setIncrementAmount] = useState(2)

  return (
    <div>
      <div className={styles.row}>
        <button
          type='button'
          className={styles.button}
          aria-label='Decrement value'
          onClick={() => dispatch(counterSlice.actions.decrement())}
        >
          -
        </button>
        <span className={styles.value}>{count}</span>
        <button
          type='button'
          className={styles.button}
          aria-label='Increment value'
          onClick={() => dispatch(counterSlice.actions.increment())}
        >
          +
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label='Set increment amount'
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(Number(e.target.value ?? 0))}
        />
        <button
          type='button'
          className={styles.button}
          onClick={() => dispatch(counterSlice.actions.incrementByAmount(incrementAmount))}
        >
          Add Amount
        </button>
        <button type='button' className={styles.asyncButton} onClick={() => dispatch(incrementAsync(incrementAmount))}>
          Add Async
        </button>
        <button type='button' className={styles.button} onClick={() => dispatch(incrementIfOddAsync(incrementAmount))}>
          Add If Odd
        </button>
      </div>
    </div>
  )
}

export default Counter

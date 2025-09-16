import { defineStore } from 'pinia'

export interface CounterState {
  value: number
  status: 'idle' | 'loading' | 'failed'
}

export const useCounterStore = defineStore('counter', {
  state: (): CounterState => ({
    value: 0,
    status: 'idle'
  }),

  getters: {
    count: (state) => state.value,
    isLoading: (state) => state.status === 'loading'
  },

  actions: {
    increment() {
      this.value += 1
    },

    decrement() {
      this.value -= 1
    },

    incrementByAmount(amount: number) {
      this.value += amount
    },

    async incrementAsync(amount: number) {
      this.status = 'loading'
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        this.value += amount
        this.status = 'idle'
      } catch (error) {
        this.status = 'failed'
        throw error
      }
    },

    incrementIfOdd(amount: number) {
      if (this.value % 2 === 1) {
        this.incrementByAmount(amount)
      }
    },

    reset() {
      this.value = 0
    }
  }
})

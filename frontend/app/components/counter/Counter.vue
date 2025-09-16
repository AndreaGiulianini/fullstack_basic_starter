<template>
  <div class="flex items-center justify-center gap-2">
    <button 
      class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
      :aria-label="t('Counter.decrement')" 
      @click="counter.decrement()"
    >
      -
    </button>

    <span class="text-2xl font-bold">{{ counter.count }}</span>

    <button 
      class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
      :aria-label="t('Counter.increment')" 
      @click="counter.increment()"
    >
      +
    </button>
  </div>
  
  <div class="flex items-center justify-center gap-2 mt-4">
    <input
      v-model.number="incrementAmount"
      class="w-20 px-2 py-1 border rounded text-center"
      :aria-label="t('Counter.count')"
      type="number"
    />
    <button 
      class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
      @click="counter.incrementByAmount(incrementAmount)"
    >
      {{ t('Counter.increment') }}
    </button>
    <button 
      class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
      @click="counter.incrementAsync(incrementAmount)"
    >
      {{ t('Counter.incrementAsync') }}
    </button>
    <button 
      class="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
      @click="counter.reset()"
    >
      {{ t('Counter.reset') }}
    </button>
  </div>
  
  <div class="mt-4 text-center text-sm text-muted-foreground">
    {{ t('Counter.status') }}: {{ counter.status }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCounterStore } from '../../../stores/counter'

const { t } = useI18n()
const counter = useCounterStore()
const incrementAmount = ref(2)
</script>

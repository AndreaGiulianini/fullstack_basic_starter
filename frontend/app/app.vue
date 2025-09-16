<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col justify-center items-center">
    <NuxtRouteAnnouncer />
    
    <!-- Language Switcher -->
    <div class="absolute top-4 right-4">
      <LanguageSwitcher />
    </div>

    <main class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-4 text-center">
        {{ t('HomePage.title') }} 
        <a 
          href="https://nuxt.com" 
          class="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nuxt.js!
        </a>
      </h1>
      
      <p class="text-center text-muted-foreground mb-8">
        {{ t('HomePage.subtitle') }}
      </p>
      
      <div class="max-w-md mx-auto">
        <h2 class="text-2xl font-semibold mb-4 text-center">
          {{ t('Counter.title') }}
        </h2>
        <Counter />
      </div>
      
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Server-side data fetching
const response = await $fetch('/api/healthcheck/ping').catch(() => null)

if (response) {
  console.log('server', response)
}
</script>

<style>
.container {
  max-width: 1200px;
}
</style>

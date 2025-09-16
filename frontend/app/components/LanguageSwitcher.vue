<template>
  <div class="relative">
    <select 
      :value="locale" 
      class="px-3 py-2 border rounded-md bg-background text-foreground appearance-none pr-8 cursor-pointer"
      @change="switchLanguage"
    >
      <option value="en">{{ t('Language.english') }}</option>
      <option value="it">{{ t('Language.italian') }}</option>
      <option value="es">{{ t('Language.spanish') }}</option>
      <option value="fr">{{ t('Language.french') }}</option>
    </select>
    
    <!-- Dropdown arrow -->
    <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
      <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, t, setLocale } = useI18n()

const switchLanguage = (event: Event) => {
  const target = event.target as HTMLSelectElement
  // Only allow valid locales
  const value = target.value as 'en' | 'it' | 'es' | 'fr'
  setLocale(value)
  console.log('Language switched to:', value)
}
</script>
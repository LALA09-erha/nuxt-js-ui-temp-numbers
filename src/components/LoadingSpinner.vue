<template>
  <div class="loading-spinner" :class="size">
    <div class="spinner"></div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.small .spinner {
  width: 30px;
  height: 30px;
  border-width: 2px;
}

.medium .spinner {
  width: 50px;
  height: 50px;
  border-width: 3px;
}

.large .spinner {
  width: 70px;
  height: 70px;
  border-width: 4px;
}

.loading-text {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
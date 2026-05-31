<template>
  <Transition name="toast">
    <div v-if="show" class="toast-notification" :class="type">
      <div class="toast-icon">
        <span v-if="type === 'success'">✅</span>
        <span v-else-if="type === 'error'">❌</span>
        <span v-else-if="type === 'warning'">⚠️</span>
        <span v-else>ℹ️</span>
      </div>
      <div class="toast-message">{{ message }}</div>
      <button class="toast-close" @click="$emit('close')">×</button>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  }
})

defineEmits(['close'])
</script>

<style scoped>
.toast-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.toast-notification.success {
  border-left: 4px solid #10b981;
}

.toast-notification.error {
  border-left: 4px solid #ef4444;
}

.toast-notification.warning {
  border-left: 4px solid #f59e0b;
}

.toast-notification.info {
  border-left: 4px solid #3b82f6;
}

.toast-icon {
  font-size: 24px;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  color: #1f2937;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #9ca3af;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.toast-close:hover {
  color: #4b5563;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .toast-notification {
    left: 20px;
    right: 20px;
    min-width: auto;
  }
}
</style>
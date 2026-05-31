<template>
  <div class="number-card" :class="{ inactive: !number.isActive }">
    <div class="card-header">
      <div class="country-info">
        <span class="country-flag">{{ getFlagEmoji(number.isoCode) }}</span>
        <span class="country-name">{{ number.countryName }}</span>
      </div>
      <div class="status-badge" :class="{ active: number.isActive }">
        {{ number.isActive ? 'Active' : 'Inactive' }}
      </div>
    </div>
    
    <div class="phone-number">
      <span class="number">{{ number.number }}</span>
      <button class="copy-btn" @click="copyNumber">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
        </svg>
      </button>
    </div>
    
    <div class="card-footer">
      <div class="stats">
        <span class="messages-count">
          📨 {{ number.messageCount }}/15 messages
        </span>
        <span class="created-at">
          🕒 {{ formatDate(number.createdAt) }}
        </span>
      </div>
      
      <div class="actions">
        <button 
          class="btn-view" 
          @click="$emit('view', number._id)"
        >
          View Messages
        </button>
        <button 
          class="btn-generate" 
          @click="$emit('generate', number._id)"
          :disabled="number.messageCount >= 15"
        >
          Generate OTP
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { copyToClipboard } from '@/utils/helpers'

const props = defineProps({
  number: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'generate'])

const getFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt())
  return String.fromCodePoint(...codePoints)
}

const copyNumber = async () => {
  await copyToClipboard(props.number.number)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.number-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 20px;
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.number-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.number-card.inactive {
  opacity: 0.6;
  background: linear-gradient(135deg, #868f96 0%, #596164 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.country-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.country-flag {
  font-size: 24px;
}

.country-name {
  font-weight: 500;
  font-size: 14px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
}

.status-badge.active {
  background: #10b981;
}

.phone-number {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  font-family: monospace;
}

.copy-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.icon {
  width: 20px;
  height: 20px;
  color: white;
}

.card-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 15px;
}

.stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 15px;
  opacity: 0.9;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-view, .btn-generate {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view {
  background: white;
  color: #667eea;
}

.btn-generate {
  background: #10b981;
  color: white;
}

.btn-generate:disabled {
  background: #6b7280;
  cursor: not-allowed;
}

.btn-view:hover, .btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(0.95);
}
</style>
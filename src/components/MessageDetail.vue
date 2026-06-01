<template>
  <div v-if="message" class="message-detail-modal" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Message Details</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="modal-body">
        <div class="detail-item">
          <label>From:</label>
          <span class="sender">{{ message.sender }}</span>
        </div>
        
        <div class="detail-item">
          <label>Service:</label>
          <span class="service">{{ message.service }}</span>
        </div>
        
        <div class="detail-item">
          <label>Phone Number:</label>
          <span class="number">{{ message.numberRef }}</span>
          <button @click="copyNumber" class="copy-detail-btn" :disabled="isCopying">
            {{ isCopying ? 'Copying...' : 'Copy' }}
          </button>
        </div>
        
        <div class="detail-item">
          <label>Received:</label>
          <span class="time">{{ formatFullDate(message.receivedAt) }}</span>
        </div>
        
        <div v-if="message.otp" class="detail-item otp-section">
          <label>OTP Code:</label>
          <div class="otp-code-large">
            <span class="otp-value">{{ message.otp }}</span>
            <button @click="copyOtp" class="copy-otp-btn" :disabled="isCopying">
              {{ isCopying ? 'Copying...' : 'Copy OTP' }}
            </button>
          </div>
        </div>
        
        <div class="detail-item">
          <label>Full Message:</label>
          <div class="message-content-full">{{ message.content }}</div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn-close" @click="close">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { copyToClipboard, formatDate } from '@/utils/helpers'
import { ref } from 'vue'
const isCopying = ref(false)
const props = defineProps({
  message: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

const copyNumber = async () => {
  isCopying.value = true
  if (props.message) {
    await copyToClipboard(props.message.numberRef)
  }
  setTimeout(() => {
    isCopying.value = false
  }, 2000)
}

const copyOtp = async () => {
  isCopying.value = true
  if (props.message && props.message.otp) {
    await copyToClipboard(props.message.otp)
  }
  setTimeout(() => {
    isCopying.value = false
  }, 2000)
}

const formatFullDate = (date) => {
  return formatDate(date, 'full')
}
</script>

<style scoped>
.message-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #9ca3af;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.modal-body {
  padding: 24px;
}

.detail-item {
  margin-bottom: 20px;
}

.detail-item label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 8px;
}

.detail-item .sender,
.detail-item .service,
.detail-item .number,
.detail-item .time {
  font-size: 16px;
  color: #1f2937;
  display: inline-block;
  margin-right: 12px;
}

.copy-detail-btn {
  padding: 4px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.copy-detail-btn:hover {
  background: #2563eb;
}

.otp-section {
  background: #f3f4f6;
  padding: 16px;
  border-radius: 12px;
  margin: 20px 0;
}

.otp-code-large {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.otp-value {
  font-size: 32px;
  font-weight: 700;
  font-family: monospace;
  color: #667eea;
  letter-spacing: 4px;
}

.copy-otp-btn {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.copy-otp-btn:hover {
  background: #059669;
}

.message-content-full {
  background: #f9fafb;
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  word-wrap: break-word;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  text-align: right;
}

.btn-close {
  padding: 10px 24px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-close:hover {
  background: #4b5563;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }
  
  .otp-value {
    font-size: 24px;
    letter-spacing: 2px;
  }
}
</style>
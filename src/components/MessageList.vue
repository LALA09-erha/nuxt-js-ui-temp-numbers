<template>
  <div class="message-list">
    <div v-if="messages.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <p>No messages yet</p>
      <button @click="generateMessage" class="btn-generate-first">
        Refresh to Update Messages
      </button>
    </div>
    
    <div v-else class="messages">
      <div 
        v-for="message in messages" 
        :key="message._id"
        class="message-item"
        :class="{ unread: !message.isRead }"
        @click="$emit('messageClick', message)"
      >
        <div class="message-header">
          <div class="sender-info">
            <span class="sender-icon">📱</span>
            <span class="sender">{{ message.sender }}</span>
            <span class="service-badge">{{ message.service }}</span>
          </div>
          <span class="time">{{ formatTime(message.receivedAt) }}</span>
        </div>
        
        <div class="message-content">
          <div class="otp-code" v-if="message.otp">
            <span class="otp-label">OTP:</span>
            <span class="otp-value">{{ message.otp }}</span>
            <button @click.stop="copyOtp(message.otp)" class="copy-otp">
              Copy
            </button>
          </div>
          <p class="message-text">{{ message.content }}</p>
        </div>
        
        <div class="message-footer" v-if="!message.isRead">
          <span class="unread-badge">New</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { copyToClipboard, formatTimeAgo } from '@/utils/helpers'

const props = defineProps({
  messages: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['generate', 'messageClick'])

const generateMessage = () => {
  window.location.reload()
}

const formatTime = (date) => {
  return formatTimeAgo(date)
}

const copyOtp = async (otp) => {
  await copyToClipboard(otp)
}
</script>

<style scoped>
.message-list {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.btn-generate-first {
  margin-top: 20px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e5e7eb;
}

.message-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-item.unread {
  border-left: 4px solid #667eea;
  background: #f9fafb;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.sender-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.sender-icon {
  font-size: 20px;
}

.sender {
  font-weight: 600;
  color: #374151;
}

.service-badge {
  padding: 2px 8px;
  background: #e5e7eb;
  border-radius: 12px;
  font-size: 11px;
  color: #4b5563;
}

.time {
  font-size: 12px;
  color: #6b7280;
}

.message-content {
  margin-bottom: 12px;
}

.otp-code {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f3f4f6;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.otp-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.otp-value {
  font-size: 24px;
  font-weight: 700;
  font-family: monospace;
  color: #667eea;
  letter-spacing: 2px;
}

.copy-otp {
  margin-left: auto;
  padding: 4px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.message-text {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.unread-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #667eea;
  color: white;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
}
</style>
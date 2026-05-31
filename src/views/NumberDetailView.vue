<template>
  <div class="number-detail">
    <div class="header">
      <button @click="goBack" class="btn-back">
        ← Back
      </button>
      <div v-if="numberStore.currentNumber" class="number-info">
        <span class="flag">{{ getFlagEmoji(numberStore.currentNumber.isoCode) }}</span>
        <span class="number">{{ numberStore.currentNumber.number }}</span>
      </div>
    </div>
    
    <div class="content">
      <div class="stats-panel" v-if="numberStore.currentNumber">
        <div class="stat">
          <div class="stat-label">Country</div>
          <div class="stat-value">{{ numberStore.currentNumber.countryName }}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Messages</div>
          <div class="stat-value">{{ numberStore.currentNumber.messageCount }}/15</div>
        </div>
        <div class="stat">
          <div class="stat-label">Status</div>
          <div class="stat-value" :class="{ active: numberStore.currentNumber.isActive }">
            {{ numberStore.currentNumber.isActive ? 'Active' : 'Inactive' }}
          </div>
        </div>
      </div>
      
      <div class="actions-bar">
        <button @click="generateMessage" class="btn-generate-message">
          ✨ Generate New Message
        </button>
        <button @click="updateMessages" class="btn-update">
          🔄 Update Messages
        </button>
        <button @click="copyNumber" class="btn-copy">
          📋 Copy Number
        </button>
      </div>
      
      <MessageList 
        :messages="messageStore.currentMessages"
        @generate="generateMessage"
        @messageClick="viewMessageDetail"
      />
    </div>
    
    <MessageDetail 
      v-if="selectedMessage"
      :message="selectedMessage"
      @close="selectedMessage = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNumberStore } from '@/stores/numberStore'
import { useMessageStore } from '@/stores/messageStore'
import MessageList from '@/components/MessageList.vue'
import MessageDetail from '@/components/MessageDetail.vue'
import { copyToClipboard } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()
const numberStore = useNumberStore()
const messageStore = useMessageStore()
const selectedMessage = ref(null)

const numberId = route.params.id

const goBack = () => {
  router.push('/')
}

const getFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt())
  return String.fromCodePoint(...codePoints)
}

const loadData = async () => {
  await numberStore.fetchNumberDetail(numberId)
  await messageStore.fetchNumberMessages(numberId)
}

const generateMessage = async () => {
  await messageStore.generateNewMessage(numberId)
  await loadData()
}

const updateMessages = async () => {
  await messageStore.updateMessages(numberId)
  await loadData()
}

const copyNumber = async () => {
  if (numberStore.currentNumber) {
    await copyToClipboard(numberStore.currentNumber.number)
  }
}

const viewMessageDetail = (message) => {
  selectedMessage.value = message
  messageStore.markAsRead(message._id)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.number-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.header {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-back {
  padding: 10px 20px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.number-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
}

.flag {
  font-size: 32px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-panel {
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.stat {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #374151;
}

.stat-value.active {
  color: #10b981;
}

.actions-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.btn-generate-message, .btn-update, .btn-copy {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-generate-message {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-update {
  background: #3b82f6;
  color: white;
}

.btn-copy {
  background: #10b981;
  color: white;
}

.btn-generate-message:hover, .btn-update:hover, .btn-copy:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-panel {
    grid-template-columns: 1fr;
  }
}
</style>
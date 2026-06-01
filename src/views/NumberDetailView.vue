<template>
  <div class="number-detail">
    <!-- <div class="header">
      <button @click="goBack" class="btn-back">
        ← Back
      </button>
    </div> -->
    
    <div class="content" style="margin-bottom: 40px;">
      <!-- Split Layout: 3/4 Messages, 1/4 Numbers -->
      <div class="split-layout">
        <!-- Left Side: Messages (75%) -->
        <div class="messages-section">
          <div class="stats-panel" v-if="numberStore.currentNumber">
            <div class="stat">
              <div class="stat-label">Country</div>
              <div class="stat-value">{{ numberStore.currentNumber.countryName }}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Messages</div>
              <div class="stat-value">{{ numberStore.currentNumber.messageCount }}/15
                <span v-if="numberStore.currentNumber.messageCount >= 15" class="tooltip" title="For database optimization, only the latest 15 messages are retained.">📝</span>
              </div>
            </div>
            <div class="stat">
              <div class="stat-label">Status</div>
              <div class="stat-value" :class="{ active: numberStore.currentNumber.isActive }">
                {{ numberStore.currentNumber.isActive ? 'Active' : 'Inactive' }}
              </div>
            </div>
          </div>
          
          <div class="actions-bar">
            <div v-if="numberStore.currentNumber" class="number-info btn-copy" @click="copyNumber">
              <span class="fi fis" :class="`fi-${numberStore.currentNumber.isoCode?.toLowerCase()}`" style="font-size: 24px;"></span>
              <span class="number">{{ numberStore.currentNumber.number }}</span>
              <button v-if="isCopying"  class="btn-copy" >
                    📋 Copying...
              </button>
              <button v-else @click="copyNumber" class="btn-copy" >
                    📋 Copy Number
              </button>
            </div>
            <button @click="updateMessages" class="btn-update" v-if="isUpdating"  disabled>
              🔄 Updating Messages...
            </button> 
            <button @click="updateMessages" class="btn-update" v-else >
              🔄 Update Messages
            </button>
            <!-- try another number button and redirect to home -->
            <button @click="goBack" class="btn-generate-message">
              🔢 View Other Numbers
            </button>
          </div>
          
          <MessageList 
            :messages="messageStore.currentMessages"
            @generate="generateMessage"
            @messageClick="viewMessageDetail"
          />
        </div>
        
        <!-- Right Side: Other Numbers (25%) -->
        <div class="numbers-section">
          <div class="section-header">
            <h3>Other Numbers</h3>
            <span class="count">{{ otherNumbers.length }} numbers</span>
          </div>
          
          <div class="numbers-list">
            <div 
              v-for="number in otherNumbers" 
              :key="number._id"
              class="number-item"
              :class="{ active: number._id === numberStore.currentNumber?._id }"
              @click="switchNumber(number._id)"
            >
              <div class="number-flag">
                <span class="fi fis" :class="`fi-${number.isoCode?.toLowerCase()}`" style="font-size: 20px;"></span>
              </div>
              <div class="number-details">
                <div class="number-value">{{ number.number }}</div>
                <div class="number-country">{{ number.countryName }}</div>
              </div>
            </div>
            
            <div v-if="otherNumbers.length === 0" class="empty-state">
              <p>No other numbers available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <MessageDetail 
      v-if="selectedMessage"
      :message="selectedMessage"
      @close="selectedMessage = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
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
const isCopying = ref(false)
const isUpdating = ref(false)

// Get numberId from route params (reactive)
const numberId = computed(() => route.params.id)

// Get other numbers (excluding current number)
const otherNumbers = computed(() => {
  return numberStore.numbers.filter(n => n._id !== numberStore.currentNumber?._id)
})

const goBack = () => {
  router.push('/')
}

const loadData = async () => {
  if (!numberId.value) return
  
  // Reset states before loading new data
  numberStore.currentNumber = null
  messageStore.currentMessages = []
  
  
  try {
    // Load all numbers first if empty
    if (numberStore.numbers.length === 0) {
      await numberStore.fetchNumbers()
    }
    
    // Load current number detail
    await numberStore.fetchNumberDetail(numberId.value)
    
    // Load messages for this number
    await messageStore.fetchNumberMessages(numberId.value)
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

const generateMessage = async () => {
  try {
    await messageStore.generateNewMessage(numberId.value)
    await loadData()
  } catch (error) {
    console.error('Failed to generate message:', error)
  }
}

const updateMessages = async () => {
  try {
    // index-DCTnViHC.js:9 Failed to update messages: TypeError: Cannot set properties of undefined (setting 'value')
    isUpdating.value = true
    await messageStore.updateMessages(numberId.value)
    setTimeout(() => {
      isUpdating.value = false
    }, 10000)
    await loadData()
  } catch (error) {
    console.error('Failed to update messages:', error)
  }
}

const copyNumber = async () => {
  if (numberStore.currentNumber) {
    isCopying.value = true
    await copyToClipboard(numberStore.currentNumber.number)
    setTimeout(() => {
      isCopying.value = false
    }, 2000)
  }
}

const viewMessageDetail = (message) => {
  selectedMessage.value = message
  messageStore.markAsRead(message._id)
}

const switchNumber = (newNumberId) => {
  if (newNumberId !== numberId.value) {
    router.push(`/number/${newNumberId}`)
  }
}

// Watch for route param changes
watch(numberId, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.tooltip {
  display: inline-block;
  margin-left: 4px;
  color: #6b7280;
  cursor: help;
}
.number-detail {
  min-height: 200vh;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.btn-back {
  padding: 10px 20px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-back:hover {
  background: #4b5563;
  transform: translateX(-2px);
}

.number-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  background-color: #f3f4f6;
  padding: 8px 16px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
}

.content {
  max-width: 1400px;
  margin: 0 auto;
}

/* Split Layout - 3/4 and 1/4 */
.split-layout {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.messages-section {
  flex: 3;
  min-width: 0; /* Prevents overflow */
}

.numbers-section {
  flex: 1;
  min-width: 250px;
}

/* Stats Panel */
.stats-panel {
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.stat {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-weight: 600;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #374151;
}

.stat-value.active {
  color: #10b981;
}

/* Actions Bar */
.actions-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  justify-content: center;
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

/* Numbers Section */
.numbers-section {
  background: white;
  border-radius: 20px;
  padding: 20px;
  height: fit-content;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #374151;
  font-weight: 600;
}

.count {
  background: #e5e7eb;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
}

.numbers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 600px;
  overflow-y: auto;
}

.number-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.number-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
  border-color: #667eea;
}

.number-item.active {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-color: #667eea;
}

.number-flag {
  flex-shrink: 0;
}

.number-details {
  flex: 1;
  min-width: 0;
}

.number-value {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  font-family: monospace;
  margin-bottom: 4px;
}

.number-country {
  font-size: 12px;
  color: #6b7280;
}

.number-badge {
  flex-shrink: 0;
}

.message-count {
  font-size: 11px;
  padding: 4px 8px;
  background: #e5e7eb;
  border-radius: 20px;
  font-weight: 600;
  color: #6b7280;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 14px;
}

/* Scrollbar styling */
.numbers-list::-webkit-scrollbar {
  width: 6px;
}

.numbers-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.numbers-list::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 10px;
}

.numbers-list::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}

/* Loading state */
.loading-state {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

/* Responsive Design */
@media (max-width: 968px) {
  .split-layout {
    flex-direction: column;
  }
  
  .messages-section, .numbers-section {
    flex: auto;
  }
  
  .numbers-section {
    position: static;
    margin-top: 20px;
  }
  
  .numbers-list {
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-panel {
    grid-template-columns: 1fr;
  }
  
  .actions-bar {
    flex-direction: column;
  }
  
  .btn-generate-message, .btn-update, .btn-copy {
    width: 100%;
  }
}
</style>
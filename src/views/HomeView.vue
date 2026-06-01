<template>
  <div class="home">
    <div class="hero">
      <h1 class="title"> 📱 SMS Generator</h1>
      <p class="subtitle">Receive SMS online instantly - Free temporary phone numbers</p>
      
      <!-- <div class="actions">
        <button @click="refreshNumbers" class="btn-refresh" :disabled="numberStore.isLoading">
          🔄 Refresh Numbers
        </button>
        <button @click="seedNumbers" class="btn-seed" :disabled="numberStore.isLoading">
          🌱 Seed Numbers
        </button>
        <button @click="generateRandomMessage" class="btn-generate" :disabled="numberStore.isLoading">
          ✨ Generate Random Message
        </button>
      </div> -->
    </div>
    
    <div v-if="numberStore.isLoading" class="loading">
      <LoadingSpinner size="large" text="Loading numbers..." />
    </div>
    
    <div v-else class="numbers-grid">
      <NumberCard
        v-for="number in numberStore.numbers"
        :key="number._id"
        :number="number"
        @view="viewNumberDetail"
        @generate="generateMessageForNumber"
      />
    </div>
    
    <ToastNotification 
      v-if="toast.show" 
      :message="toast.message" 
      :type="toast.type"
      @close="toast.show = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNumberStore } from '@/stores/numberStore'
import { useMessageStore } from '@/stores/messageStore'
import NumberCard from '@/components/NumberCard.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useWebSocket } from '@/composables/useWebSocket'

const router = useRouter()
const numberStore = useNumberStore()
const messageStore = useMessageStore()
const toast = ref({ show: false, message: '', type: 'info' })

const wsUrl = import.meta.env.VITE_WS_URL
const { connect, onMessage, disconnect } = useWebSocket(wsUrl)

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const refreshNumbers = async () => {
  try {
    await numberStore.fetchNumbers()
  } catch (error) {
    showToast('Failed to refresh numbers', 'error')
  }
}

const seedNumbers = async () => {
  try {
    await numberStore.seedNumbers()
    showToast('Numbers seeded successfully!')
  } catch (error) {
    showToast('Failed to seed numbers', 'error')
  }
}

const generateRandomMessage = async () => {
  try {
    await messageStore.generateNewMessage()
    showToast('New message generated!')
    await refreshNumbers()
  } catch (error) {
    showToast('Failed to generate message', 'error')
  }
}

const generateMessageForNumber = async (numberId) => {
  try {
    await messageStore.generateNewMessage(numberId)
    showToast('Message generated for this number!')
    await refreshNumbers()
  } catch (error) {
    showToast('Failed to generate message', 'error')
  }
}

const viewNumberDetail = (numberId) => {
  router.push(`/number/${numberId}`)
}

onMounted(async () => {
  await refreshNumbers()
  
  // Setup WebSocket for real-time updates
  connect()
  onMessage((data) => {
    if (data.type === 'NEW_MESSAGE') {
      showToast(`New message received for ${data.number}!`, 'info')
      refreshNumbers()
    }
  })
})

onUnmounted(() => {
  disconnect()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.hero {
  text-align: center;
  padding: 60px 20px 40px;
  background: white;
  margin-bottom: 40px;
}

.title {
  font-size: 48px;
  font-weight: 800;
  color: #667eea;
  font-family: 'Poppins', sans-serif;
  -webkit-background-clip: text;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 32px;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-refresh, .btn-seed, .btn-generate {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-refresh {
  background: #3b82f6;
  color: white;
}

.btn-seed {
  background: #10b981;
  color: white;
}

.btn-generate {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-refresh:hover, .btn-seed:hover, .btn-generate:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.loading {
  text-align: center;
  padding: 60px;
}

.numbers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .numbers-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .title {
    font-size: 32px;
  }
  
  .actions {
    flex-direction: column;
    padding: 0 20px;
  }
}
</style>
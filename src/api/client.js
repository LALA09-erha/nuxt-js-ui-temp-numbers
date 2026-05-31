import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor
apiClient.interceptors.request.use(
    config => {
        // Add loading indicator
        document.body.style.cursor = 'wait'
        return config
    },
    error => {
        document.body.style.cursor = 'default'
        return Promise.reject(error)
    }
)

// Response interceptor
apiClient.interceptors.response.use(
    response => {
        document.body.style.cursor = 'default'
        return response
    },
    error => {
        document.body.style.cursor = 'default'
        console.error('API Error:', error)
        return Promise.reject(error)
    }
)

export default {
    // Numbers
    async getNumbers() {
        const response = await apiClient.get('/numbers')
        return response.data
    },

    async getNumberDetail(id) {
        const response = await apiClient.get(`/numbers/${id}`)
        return response.data
    },

    async updateNumber() {
        const response = await apiClient.get('/numbers/update')
        return response.data
    },

    // Messages
    async generateMessage(numberId = null) {
        const url = numberId
            ? `/messages/generate?numberId=${numberId}`
            : '/messages/generate'
        const response = await apiClient.get(url)
        return response.data
    },

    async getAllMessages() {
        const response = await apiClient.get('/messages')
        return response.data
    },

    async getNumberMessages(numberId) {
        const response = await apiClient.get(`/messages/${numberId}`)
        return response.data
    },

    async updateMessages(numberId) {
        const response = await apiClient.get(`/messages/update?numberId=${numberId}`)
        return response.data
    },

    // Seed
    async seedNumbers() {
        const response = await apiClient.get('/numbers/seed')
        return response.data
    }
}
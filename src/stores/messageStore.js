import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/client'

export const useMessageStore = defineStore('message', () => {
    const messages = ref([])
    const currentMessages = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const unreadMessages = computed(() =>
        messages.value.filter(msg => !msg.isRead)
    )

    const groupedByNumber = computed(() => {
        const grouped = {}
        messages.value.forEach(msg => {
            if (!grouped[msg.numberRef]) {
                grouped[msg.numberRef] = []
            }
            grouped[msg.numberRef].push(msg)
        })
        return grouped
    })

    const fetchAllMessages = async () => {
        isLoading.value = true
        try {
            const data = await api.getAllMessages()
            messages.value = data.data
            return data
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const fetchNumberMessages = async (numberId) => {
        isLoading.value = true
        try {
            const data = await api.getNumberMessages(numberId)
            currentMessages.value = data.data
            return data
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const generateNewMessage = async (numberId = null) => {
        try {
            const data = await api.generateMessage(numberId)
            await fetchAllMessages()
            return data
        } catch (err) {
            error.value = err.message
            throw err
        }
    }

    const updateMessages = async (numberId) => {
        try {
            const data = await api.updateMessages(numberId)
            await fetchNumberMessages(numberId)
            return data
        } catch (err) {
            error.value = err.message
            throw err
        }
    }

    const markAsRead = (messageId) => {
        const message = messages.value.find(m => m._id === messageId)
        if (message && !message.isRead) {
            message.isRead = true
        }
    }

    return {
        messages,
        currentMessages,
        isLoading,
        error,
        unreadMessages,
        groupedByNumber,
        fetchAllMessages,
        fetchNumberMessages,
        generateNewMessage,
        updateMessages,
        markAsRead
    }
})
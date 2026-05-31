import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/client'

export const useNumberStore = defineStore('number', () => {
    const numbers = ref([])
    const currentNumber = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    const activeNumbers = computed(() =>
        numbers.value.filter(num => num.isActive)
    )

    const availableNumbers = computed(() =>
        numbers.value.filter(num => num.messageCount < 15)
    )

    const fetchNumbers = async () => {
        isLoading.value = true
        try {
            const data = await api.getNumbers()
            numbers.value = data
            error.value = null
            return data
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const fetchNumberDetail = async (id) => {
        isLoading.value = true
        try {
            const data = await api.getNumberDetail(id)
            currentNumber.value = data
            return data
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const seedNumbers = async () => {
        isLoading.value = true
        try {
            const data = await api.seedNumbers()
            await fetchNumbers()
            return data
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const updateNumberStatus = async () => {
        try {
            await api.updateNumber()
            await fetchNumbers()
        } catch (err) {
            error.value = err.message
            throw err
        }
    }

    return {
        numbers,
        currentNumber,
        isLoading,
        error,
        activeNumbers,
        availableNumbers,
        fetchNumbers,
        fetchNumberDetail,
        seedNumbers,
        updateNumberStatus
    }
})
import { ref } from 'vue'
import api from '@/api/client'

export function useApi() {
    const loading = ref(false)
    const error = ref(null)

    const execute = async (apiCall, ...params) => {
        loading.value = true
        error.value = null
        try {
            const result = await apiCall(...params)
            return result
        } catch (err) {
            error.value = err.response?.data?.message || err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        execute
    }
}
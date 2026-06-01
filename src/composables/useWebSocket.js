import { ref, onUnmounted } from 'vue'

export function useWebSocket(url) {
    const ws = ref(null)
    const isConnected = ref(false)
    const lastMessage = ref(null)

    const connect = () => {
        ws.value = new WebSocket(url)

        ws.value.onopen = () => {
            isConnected.value = true

        }

        ws.value.onclose = () => {
            isConnected.value = false

        }

        ws.value.onerror = (error) => {
            console.error('WebSocket error:', error)
        }
    }

    const disconnect = () => {
        if (ws.value) {
            ws.value.close()
        }
    }

    const sendMessage = (message) => {
        if (ws.value && isConnected.value) {
            ws.value.send(JSON.stringify(message))
        }
    }

    const onMessage = (callback) => {
        if (ws.value) {
            ws.value.onmessage = (event) => {
                const data = JSON.parse(event.data)
                lastMessage.value = data
                callback(data)
            }
        }
    }

    onUnmounted(() => {
        disconnect()
    })

    return {
        connect,
        disconnect,
        sendMessage,
        onMessage,
        isConnected,
        lastMessage
    }
}
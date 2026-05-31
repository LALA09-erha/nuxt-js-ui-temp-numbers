export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        // Show success notification (implement your own)
        console.log('Copied to clipboard:', text)
        return true
    } catch (err) {
        console.error('Failed to copy:', err)
        return false
    }
}

export const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    }

    for (const [unit, value] of Object.entries(intervals)) {
        const count = Math.floor(seconds / value)
        if (count >= 1) {
            return `${count} ${unit}${count > 1 ? 's' : ''} ago`
        }
    }

    return 'just now'
}

export const formatDate = (date, format = 'MM/DD/YYYY') => {
    const d = new Date(date)
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const year = d.getFullYear()
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')

    switch (format) {
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`
        case 'full':
            return `${month}/${day}/${year} ${hours}:${minutes}`
        default:
            return `${month}/${day}/${year}`
    }
}

export const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func.apply(this, args), delay)
    }
}

export const throttle = (func, limit) => {
    let inThrottle
    return (...args) => {
        if (!inThrottle) {
            func.apply(this, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}
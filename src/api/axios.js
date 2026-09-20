import axios from 'axios'

const client= axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})


client.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default client
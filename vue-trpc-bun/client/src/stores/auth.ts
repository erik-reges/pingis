import { defineStore } from 'pinia'
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  type User,
  setPersistence,
  browserLocalPersistence,
  initializeAuth,
  indexedDBLocalPersistence,
} from 'firebase/auth'
import { computed, ref } from 'vue'
import { getApp } from 'firebase/app'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const auth = initializeAuth(getApp(), {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  })

  onAuthStateChanged(auth, (firebaseUser) => {
    console.log('Auth state changed:', firebaseUser?.email) // Debug log
    user.value = firebaseUser
    loading.value = false
  })

  const isAuthenticated = computed(() => {
    return !!user.value
  })

  const login = async (email: string, password: string) => {
    try {
      error.value = null
      loading.value = true
      await setPersistence(auth, browserLocalPersistence)
      const result = await signInWithEmailAndPassword(auth, email, password)
      user.value = result.user
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
  }
})

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const { user, loading } = storeToRefs(auth)

watch([user, loading], ([newUser, newLoading]) => {
  if (!newLoading && !newUser) {
    router.push('/login')
  }
})
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center min-h-screen">Loading...</div>
  <slot v-else-if="user" />
  <div v-else class="flex justify-center items-center min-h-screen">Redirecting to login...</div>
</template>

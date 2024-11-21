<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const { user, loading } = storeToRefs(auth)

watch(
  [user, loading],
  ([newUser, newLoading]) => {
    if (!newLoading && !newUser) {
      router.push('/login')
    }
  },
  { immediate: true },
)
</script>

<template>
  <template v-if="loading">
    <div class="flex justify-center items-center min-h-screen">Loading...</div>
  </template>
  <template v-else-if="user">
    <slot />
  </template>
  <template v-else>
    <div class="flex justify-center items-center min-h-screen">Redirecting to login...</div>
  </template>
</template>

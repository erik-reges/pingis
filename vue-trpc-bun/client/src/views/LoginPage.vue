<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const router = useRouter()
const { user, error } = storeToRefs(auth)

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  if (!email.value || !password.value) return

  try {
    loading.value = true
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    console.error('Auth error:', e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <Card class="w-full max-w-md shadow-xl">
      <template #title>
        <h1 class="text-2xl font-bold text-gray-800 text-center mb-4">Welcome Back</h1>
      </template>

      <template #content>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-6 p-4">
          <div class="flex flex-col gap-2">
            <label class="text-gray-700 font-medium">Email</label>
            <InputText
              v-model="email"
              type="email"
              required
              :disabled="loading"
              class="p-3 rounded-lg border-gray-300 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-gray-700 font-medium">Password</label>
            <InputText
              v-model="password"
              type="password"
              required
              :disabled="loading"
              class="p-3 rounded-lg border-gray-300 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <small v-if="error" class="text-red-500 text-center font-medium bg-red-50 p-2 rounded">
            {{ error }}
          </small>

          <Button
            label="Login"
            type="submit"
            :loading="loading"
            class="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { trpc } from './trpc'
import { ref, onMounted } from 'vue'
</script>

<template>
  <RouterView />
</template>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.brand {
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 2rem;
}

.content {
  flex: 1;
  padding: 1rem;
  width: '100vw';
}

:deep(.p-menubar) {
  padding: 0.5rem 1rem;
  border: none;
}

:deep(.p-button-text) {
  color: var(--primary-color);
}

:deep(.p-button-text:hover) {
  background: var(--primary-50);
}
</style>

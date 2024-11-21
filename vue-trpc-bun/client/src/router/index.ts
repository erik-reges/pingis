import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { watch } from 'vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('../views/LoginPage.vue'),
    },
    {
      path: '/',
      component: () => import('../views/PingisLeaderboard.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // If loading, just proceed (AuthGuard will handle the wait)
  if (auth.loading) {
    next()
    return
  }

  if (to.meta.requiresAuth && !auth.user) {
    next('/login')
  } else if (to.path === '/login' && auth.user) {
    next('/')
  } else {
    next()
  }
})

export default router

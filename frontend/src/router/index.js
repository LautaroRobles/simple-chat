import LobbyViewVue from '@/views/LobbyView.vue'
import ChatViewVue from '@/views/ChatView.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'lobby',
    component: LobbyViewVue
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatViewVue,
    props: true,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

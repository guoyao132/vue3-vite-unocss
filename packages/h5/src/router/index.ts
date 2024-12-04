import { createRouter, createWebHashHistory } from 'vue-router'

import { RouteToName } from '@/common/js/route-to-name'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: RouteToName.home,
      redirect: '/index',
      meta: {
        keepAlive: true,
        tabBar: true,
      },
      component: () => import('@/views/home/home.vue'),
      children: [
        {
          path: '/index',
          name: RouteToName.index,
          meta: {
            tabBar: true,
            title: '工作台',
          },
          component: () => import('@/views/first/index.vue'),
        },
      ],
    },
  ],
})

export default router

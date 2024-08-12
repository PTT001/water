import { createRouter, createWebHashHistory } from 'vue-router';

export const constantRoutes = [
  {
    path: '/',
    redirect: '/Home',
  },

  {
    path: '/Home',
    component: () => import('../components/Home.vue'),
  },

  {
    path: '/pray',
    component: () => import('../components/Pray.vue'),
  },

  {
    path: '/result',
    component: () =>
      import(/* webpackPrefetch: true */ '../components/result.vue'),
  },

  //   {
  //     path: '/404',
  //     name: 'NotFound',
  //     component: NotFound,
  //   },
  //   // 404 page must be placed at the end !!!
  //   { path: '/:pathMatch(.*)', redirect: '/404', hidden: true },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
});

export default router;

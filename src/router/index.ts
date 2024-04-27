import { createRouter, createWebHistory } from "vue-router";
import AppsRoutes from "./apps.routes";

export const routes = [
  {
    path: "/",
    redirect: "/home",
    meta: {},
  } as any,
  {
    path: "/home",
    meta: {
      requiresAuth: true,
      layout: "landing",
    },
    component: () => import("@/views/pages/HomeView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "error",
    component: () => import("@/views/errors/NotFoundPage.vue"),
  },
  ...AppsRoutes,
];

const router = createRouter({
  history: createWebHistory(),

  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;

import todoRoutes from "@/views/app/todo/todoRoutes";
import emailRoutes from "@/views/app/email/emailRoutes";


export default [
  {
    path: "/apps/board",
    name: "app-board",
    component: () =>
      import(
        /* webpackChunkName: "utility-board" */ "@/views/utility/BoardPage.vue"
      ),
    meta: {
      requiresAuth: true,
      title: "Board",
      layout: "ui",
      category: "APP",
    },
  },
  {
    path: "/apps/email",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "APP",
      title: "Email",
    },
    component: () =>
      import(
        /* webpackChunkName: "app-email" */ "@/views/app/email/EmailApp.vue"
      ),
    children: [...emailRoutes],
  },

  {
    path: "/apps/todo",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "APP",
      title: "Todo",
    },
    component: () =>
      import(/* webpackChunkName: "app-todo" */ "@/views/app/todo/TodoApp.vue"),
    children: [...todoRoutes],
  },
];

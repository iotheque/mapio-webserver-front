export default [
  {
    path: "/apps/docker",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "Setup",
      title: "Docker",
    },
    component: () => import("@/views/DockerView.vue"),
  },
  {
    path: "/apps/wifi",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "Setup",
      title: "Wifi",
    },
    component: () => import("@/views/WifiView.vue"),
  },
  {
    path: "/apps/ssh",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "Setup",
      title: "SSH",
    },
    component: () => import("@/views/SshView.vue"),
  },
  {
    path: "/apps/update",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "Setup",
      title: "Update",
    },
    component: () => import("@/views/UpdateView.vue"),
  },
  {
    path: "/apps/logs",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "Setup",
      title: "Logs",
    },
    component: () => import("@/views/LogsView.vue"),
  },
  {
    path: "/apps/edit",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "Setup",
      title: "Edit Config",
    },
    component: () => import("@/views/EditView.vue"),
  },
];

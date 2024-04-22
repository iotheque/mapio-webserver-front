import menuApps from "./menus/apps.menu";

export default {
  menu: [
    {
      text: "",
      key: "",
      items: [
        {
          key: "menu.home",
          text: "Home",
          link: "/home",
          icon: "mdi-view-dashboard-outline",
        },
      ],
    },
    {
      text: "Setup",
      items: menuApps,
    },
  ],
};

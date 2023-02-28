import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "实验室基本信息", icon: "dashboard" },
      },
    ],
  },

  {
    path: "/device",
    component: Layout,
    redirect: "/device/machine",
    name: "Machine",
    meta: { title: "全要素可信管理", icon: "el-icon-s-help" },
    children: [
      {
        path: "machine",
        name: "Table",
        component: () => import("@/views/device/machine/index"),
        meta: { title: "检测设备信息", icon: "table" },
      },
      {
        path: "station",
        name: "Station",
        component: () => import("@/views/device/station/index"),
        meta: { title: "检测工位信息", icon: "tree" },
      },
      {
        path: "staff",
        name: "Staff",
        component: () => import("@/views/device/staff/index"),
        meta: { title: "人员信息", icon: "user" },
      },
    ],
  },

  {
    path: "/task",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Task",
        component: () => import("@/views/tasks/index"),
        meta: { title: "检测任务", icon: "form" },
      },
    ],
  },

  {
    path: "/issue",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Issue",
        component: () => import("@/views/issue/index"),
        meta: { title: "检测质量问题", icon: "form" },
      },
    ],
  },

  {
    path: "external-link",
    component: Layout,
    children: [
      {
        path: "http://139.196.110.174:8080/#/blocks",
        meta: { title: "完整区块数据", icon: "link" },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  // { path: "*", redirect: "/404", hidden: true },
];

// 需要将原来constantRoutes中的`{ path: '*', redirect: '/404', hidden: true }`注释掉。
// export const asyncRoutes = [
//   {
//     path: "/test",
//     component: Layout,
//     meta: { title: "Test", icon: "tree" },
//     children: [
//       {
//         path: "test1",
//         name: "test1",
//         component: () => import("@/views/tree/index"),
//         meta: { title: "test1", icon: "tree", roles: ["admin"] },
//       },
//       {
//         path: "test2",
//         name: "test2",
//         component: () => import("@/views/tree/index"),
//         meta: { title: "test2", icon: "tree", roles: ["editor"] },
//       },
//     ],
//   },

//   // 404 page must be placed at the end !!!
//   { path: "*", redirect: "/404", hidden: true },
// ];
export const asyncRoutes = [
  {
    path: "/nested",
    component: Layout,
    redirect: "/nested/menu1",
    name: "Nested",
    meta: {
      title: "权限管理",
      icon: "nested",
      roles: ["admin", "editor"],
    },
    children: [
      {
        path: "menu1",
        component: () => import("@/views/permission/node/index"), // Parent router-view
        name: "Menu1",
        meta: { title: "区块链节点信息", roles: ["admin"] },
      },
      // {
      //   path: "menu2",
      //   component: () => import("@/views/permission/user/index"),
      //   name: "Menu2",
      //   meta: { title: "设备身份注册", roles: ["editor", "admin"] },
      // },
    ],
  },
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;

export const routes = [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            path: '/user',
            redirect: '/user/login',
          },
          {
            name: 'login',
            icon: 'smile',
            path: '/user/login',
            component: './user/login',
          },
          {
            name: 'register-result',
            icon: 'smile',
            path: '/user/register-result',
            component: './user/register-result',
          },
          {
            name: 'register',
            icon: 'smile',
            path: '/user/register',
            component: './user/register',
          },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        // redirect: '/recordList',
        routes: [
          {
            path: '/',
            redirect: '/userManagement/list',
          },
          {
            path: '/userManagement',
            icon: 'user',
            name: 'userManagement',
            // component: './userManagement',
            // authority: ['admin3'],
            routes: [{
              name: 'userManagementList',
              icon: 'unordered-list',
              path: '/userManagement/list',
              component: './userManagement/list',
            }, {
              name: 'userManagementAdd',
              icon: 'smile',
              path: '/userManagement/add',
              component: './userManagement/add',
              hideInMenu: true,
            }, {
              name: 'userManagementEdit',
              icon: 'smile',
              path: '/userManagement/edit',
              component: './userManagement/add',
              hideInMenu: true,
            }]
          },
          {
            path: '/workOrder',
            icon: 'snippets',
            name: 'workOrder',
            // component: './userManagement',
            // authority: ['admin3'],
            routes: [{
              name: 'workOrderList',
              icon: 'unordered-list',
              path: '/workOrder/list',
              component: './workOrder/list',
            }, {
              name: 'workOrderAdd',
              icon: 'smile',
              path: '/workOrder/add',
              component: './workOrder/add',
              hideInMenu: true,
            }]
          },
          {
            path: '/',
            // redirect: '/dashboard/analysis',
            redirect: '/listbasiclist',
            authority: ['admin', 'user'],
          },
          {
            component: '404',
          },
        ],
      },
    ],
  },
]

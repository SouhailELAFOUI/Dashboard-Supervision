import React from 'react'

//const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const DashboardPage = React.lazy(() => import('./views/dashboard/DashboardPage'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboardPage', name: 'DashboardPage', element: DashboardPage },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
]

export default routes

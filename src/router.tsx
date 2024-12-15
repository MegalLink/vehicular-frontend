import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import GoogleCallback from './pages/auth/GoogleCallback'
import { useAuthStore } from './stores/authStore'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Repuestos from './pages/dashboard/Repuestos'
import Categorias from './pages/dashboard/Categorias'
import Marcas from './pages/dashboard/Marcas'
import Usuarios from './pages/dashboard/Usuarios'
import OrdenesCompra from './pages/dashboard/OrdenesCompra'
import CategoryForm from './pages/dashboard/CategoryForm'
import NuevoRepuesto from './pages/dashboard/repuestos/NuevoRepuesto'
import EditarRepuesto from './pages/dashboard/repuestos/EditarRepuesto'
import SparePartDetail from './pages/SparePartDetail'
import { Box } from '@chakra-ui/react'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // Verificar si el usuario tiene rol de admin o employee
  const hasAccess = user?.roles.some(role => ['admin', 'employee'].includes(role))
  
  if (!hasAccess) {
    return <Navigate to="/" />
  }

  return children
}

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}

const Layout = () => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navigation />
      <Box as="main">
        <Outlet />
      </Box>
    </Box>
  )
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/repuestos/:id',
        element: <SparePartDetail />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/auth/login-google-success',
        element: <GoogleCallback />,
      },
      {
        path: '/dashboard',
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="repuestos" replace />,
          },
          {
            path: 'repuestos',
            element: <Repuestos />,
          },
          {
            path: 'repuestos/nuevo',
            element: <NuevoRepuesto />,
          },
          {
            path: 'repuestos/:id/editar',
            element: <EditarRepuesto />,
          },
          {
            path: 'categorias',
            element: <Categorias />,
          },
          {
            path: 'categorias/nuevo',
            element: <CategoryForm />,
          },
          {
            path: 'categorias/:id',
            element: <CategoryForm />,
          },
          {
            path: 'marcas',
            element: <Marcas />,
          },
          {
            path: 'usuarios',
            element: <Usuarios />,
          },
          {
            path: 'ordenes-compra',
            element: <OrdenesCompra />,
          },
        ],
      },
    ],
  },
])

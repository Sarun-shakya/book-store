import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, BrowserRouter } from 'react-router-dom'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import './index.css'
import App from './App.jsx'
import UserLayout from './layouts/UserLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import { CartProvider } from './context/cartContext.jsx'
import { AuthProvider } from './context/authContext.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './routes/AdminRoute.jsx'

// user
import Home from './pages/Home.jsx'
import Books from './pages/Books.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import BookDetails from './pages/BookDetails.jsx'
import Cart from './pages/Cart.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import Checkout from './pages/Checkout.jsx'
import Success from './pages/Success.jsx'
import Failure from './pages/Failure.jsx'
import Wishlist from './pages/Wishlist.jsx'

// admin
import AddBook from './pages/admin/AddBook.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import ManageCategories from './pages/admin/ManageCategories.jsx'
import ManageOrders from './pages/admin/ManageOrders.jsx'
import AdminProfile from './pages/admin/AdminProfile.jsx'
import ManageBooks from './pages/admin/ManageBooks.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import ManageUsers from './pages/admin/ManageUsers.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* User */}
      <Route path='/' element={<UserLayout />}>

        {/* Public Routes */}
        <Route path='' element={<Home />} />
        <Route path='books' element={<Books />} />
        <Route path='books/:id' element={<BookDetails />} />
        <Route path='about' element={<About />} />
        <Route path='contact' element={<Contact />} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />

        {/* Protected Routes */}
        <Route
          path='profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='checkout'
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path='wishlist'
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route 
          path='cart' 
          element={
           <ProtectedRoute>
            <Cart />
           </ProtectedRoute>
            } 
          />

        <Route path='success' element={<Success />} />
        <Route path='failure' element={<Failure />} />

      </Route>

      {/* Admin */}
      <Route path='/admin/login' element={<AdminLogin />} />
      <Route 
        path='/admin'
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
        >
          <Route index element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='manage-books' element={<ManageBooks />} />
          <Route path='manage-categories' element={ <ManageCategories />} />
          <Route path='manage-orders' element={ <ManageOrders />} />
          <Route path='add-book' element={ <AddBook />} />
          <Route path='profile' element={ <AdminProfile />} />
          <Route path='manage-users' element={ <ManageUsers />} />

      </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={5000} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
import './App.css'
import Nav from './components/Nav'
import Login from './pages/Login'
import Signup from "./pages/Signup"
import Home from './pages/Home'
import Logout from './pages/Logout'
import Create from './pages/Create'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CardDetails from './components/CardDetails'
import Blog from './pages/Blog'
import Yourblogs from './pages/Yourblogs'
import Dashboard from './pages/Dashboard'
import Profile from './components/Profile'
// import { getBlogsData } from './api/GetApiData'


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Nav/> <Home/></>
    },
    {
      path: "/user/login",
      element: <>  <Login/></>
    },
    {
      path: "/user/signup",
      element: <>  <Signup/></>
    },
    {
      path: "/user/logout",
      element: <><Nav/> <Logout/></>
    },
    {
      path: "/blog/create",
      element: <><Nav/> <Create/></>
    },
    {
      path: "/blog/:id",
      element: <><Nav/> <Blog/></>
    },
    {
      path: '/blog/yourblogs',
      element: <><Nav/> <Yourblogs/></>
    },
    {
      path: '/user/dashboard',
      element: <><Nav/> <Dashboard/></>
    },
    {
      path: '/user/profile',
      element: <><Nav/> <Profile/></>
    }
  ])
  
  return (
    <RouterProvider router={router}/>
  )
}

export default App

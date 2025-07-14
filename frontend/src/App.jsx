import { Routes , Route, createBrowserRouter, BrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home'
import UserLogin from './Pages/User/UserLogin'
import UserRegister from './Pages/User/UserRegister'
import CaptainLogin from './Pages/Captain/CaptainLogin'
import CaptainRegister from './Pages/Captain/CaptainRegister'
import UserScreen from './Pages/User/UserScreen'
import CaptainScreen from './Pages/Captain/CaptainScreen'
import './App.css'
import UserProtected from './ProtectedRoutes/UserProtected'
import CaptainProtected from './ProtectedRoutes/CaptainProtected'
import UserRiding from './Pages/User/UserRiding'
import CaptainRiding from './Pages/Captain/CaptainRiding'

import 'mapbox-gl/dist/mapbox-gl.css';
import ForgotPassword from './Components/ForgotPassword'
import { useState } from 'react'
import { useEffect } from 'react'

function App() {

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const router = createBrowserRouter([
    
        { 
          path:'/',
          element: <Home/>
        },
        
        {
          path:'/User-login',
          element:<UserLogin/>
        },
        {
          path:'/User-register',
          element:<UserRegister/>
        },
        {
          path:'/Captain-login',
          element :<CaptainLogin/>
        },
        {
          path : '/Captain-register',
          element:<CaptainRegister/> 
        },
        {
          path : '/User-screen',
          element: <UserProtected> <UserScreen/> </UserProtected>
        },
        {
          path : '/Captain-screen',
          element :<CaptainProtected>  <CaptainScreen/> </CaptainProtected>
        },
        {
          path: '/User-riding',
          element: <UserProtected> <UserRiding/> </UserProtected>
        },
        {
          path:'/Captain-riding',
          element: <CaptainProtected> <CaptainRiding/> </CaptainProtected>
        },
        {
          path : '/forgot-password',
          element : <ForgotPassword/>
        }
      
  ])

  return (
  <>
      {!isMobile && (
        <div className="fixed inset-0 z-50 bg-[#7CFFD7] bg-opacity-90 text-black flex flex-col items-center justify-center text-center p-4 text-xl">
          <img src='https://img.freepik.com/free-vector/cute-phone-scientist-holding-lab-tube-cartoon-vector-icon-illustration-science-technology-isolated_138676-11656.jpg?semt=ais_hybrid&w=740'
           className='max-w-[200px] rounded-2xl' />
          📱 This application is designed for mobile screens.  
          <br />
          Please resize your window to less than 500px width.
        </div>
      )}

      <RouterProvider router={router} />
    </>
  )
}

export default App

import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import './App.css'
import authService from "./appwrite/auth";
import {login, logout} from "./store/authSlice";
import Header from "./components/header/header.jsx";
import Footer from "./components/footer/footer.jsx";
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch  = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if(userData) {
        dispatch(login({userData}))
      }else{
          dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [dispatch])
 
 return !loading ? (
  <div className='min-h-screen flex flex-col bg-gray-50'>
    <Header/>
    <main className='flex-1'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <Outlet/>
      </div>
    </main>
    <Footer/>
  </div>
 ) : null 

}

export default App

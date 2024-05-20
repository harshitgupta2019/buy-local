import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import RegisterForm from './pages/RegisterForm/RegisterForm'
import Login from './pages/Login/Login'

const AllRoutes = () => {
  return (
    <Routes>
        <Route  path='/' element={<Home/>}/>
        <Route  path='/register' element={<RegisterForm/>}/>
        <Route  path='/login' element={<Login/>}/>
    </Routes>
  )
}

export default AllRoutes

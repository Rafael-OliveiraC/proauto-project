import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Login from './Pages/Login/Login'
import Page404 from './Pages/Page404/Page404'
import UserProfile from './Pages/UserProfile/UserProfile'

import './main.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="UserProfile/:id" element={<UserProfile/>}/>
          <Route path="/*" element={<Page404/>}/>
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

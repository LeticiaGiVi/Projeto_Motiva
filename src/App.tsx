import { useState } from 'react'
import Header from './componentes/Header/Header'
import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col justify-between items-center">
    <Header/>
    <Outlet/>
    </div>
    </>
  )
}

export default App

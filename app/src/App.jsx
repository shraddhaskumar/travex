import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from './pages/About'
import Header from './components/Header'

function App() {

  return (
    <>
      <div>
        <Header/>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        
        
        </Routes>
      </BrowserRouter>
      </div>
    </>
  )
}

export default App

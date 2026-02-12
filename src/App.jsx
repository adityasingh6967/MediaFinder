import React, { useState } from 'react';
import { Bell, ChevronDown, Ellipsis, Menu } from 'lucide-react'
import { Routes, Route } from 'react-router-dom';
import Collection from './pages/Collections';
import HomePage from './pages/HomePage';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ImageEditor from './pages/ImageEditor';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (<>
    <div className="bg-neutral-900 min-w-vdw min-h-screen text-white">
      <nav className='w-full sticky z-50 top-0 flex items-center justify-center h-21 border-b border-[#202020] bg-neutral-900'>
        <div className='w-[85%] flex items-center justify-between'>
          <a className='p-2 rounded-full cursor-pointer hover:bg-[#202020] duration-200'>
            <img src="../src/assets/logo1.png" className='h-12 w-12' alt="" />
          </a>
          <div className='flex gap-3 items-center font-semibold relative'>
            <button className='md:flex hidden items-center  duration-200 gap-1 py-3 px-4 hover:bg-[#202020] rounded-full cursor-pointer text-[17px]'>Explore <ChevronDown size={18} strokeWidth={3} /></button>
            <button className='items-center  duration-200 gap-1 py-3 px-4 md:flex hidden hover:bg-[#202020] rounded-full cursor-pointer text-[17px]'>License</button>
            <button className='cursor-pointer duration-200 p-3 rounded-full md:flex hidden hover:bg-[#202020] ellipsisBtn'><Ellipsis size={16} /></button>
            <div className="ellipsisToggle z-10 absolute top-12 hidden md:flex flex-col p-1.5 gap-1 rounded-lg bg-neutral-800 left-50">
              <Link to='/collection' className='cursor-pointer px-3 rounded-lg hover:bg-[#181818] duration-200  py-4'>Collection</Link>
              <Link to='/' className='cursor-pointer px-3 rounded-lg hover:bg-[#181818] duration-200  py-4'>Search</Link>
              <Link to='/edit' className='cursor-pointer px-3 rounded-lg hover:bg-[#181818] duration-200  py-4'>Editor</Link>
            </div>
            <button className='cursor-pointer md:flex hidden duration-200 p-3 rounded-full hover:bg-[#202020]'><Bell /></button>
            <button className='cursor-pointer duration-200 p-0.75 rounded-full hover:bg-[#202020]'><span className='bg-[#ef6c00] px-4 py-2 rounded-full text-2xl'>K</span></button>
            <button className='cursor-pointer md:flex hidden duration-200  py-3 px-5 hover:bg-[#202020] rounded-lg border border-neutral-800 bg-neutral-950'>Upload</button>

            <button className="hamburger flex md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu /></button>
          </div>
        </div>
        <div
          className={`absolute top-full left-0 w-full bg-neutral-900 border-b border-[#202020] flex flex-col p-4 md:hidden z-40 overflow-hidden transition-all duration-300 ease-out ${
            isMenuOpen
              ? 'max-h-96 opacity-100 translate-y-0 pointer-events-auto'
              : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <Link to='/' className='p-3 hover:bg-[#202020] rounded-lg font-semibold' onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to='/collection' className='p-3 hover:bg-[#202020] rounded-lg font-semibold' onClick={() => setIsMenuOpen(false)}>Collection</Link>
          <Link to='/edit' className='p-3 hover:bg-[#202020] rounded-lg font-semibold' onClick={() => setIsMenuOpen(false)}>Editor</Link>
          <div className="h-px bg-[#202020] my-2"></div>
          <button className='p-3 text-left hover:bg-[#202020] rounded-lg font-semibold'>Explore</button>
          <button className='p-3 text-left hover:bg-[#202020] rounded-lg font-semibold'>License</button>
          <button className='p-3 text-left hover:bg-[#202020] rounded-lg font-semibold'>Upload</button>
        </div>
      </nav>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/edit' element={<ImageEditor />} />
      </Routes>
    </div>  </>
  )
}

export default App

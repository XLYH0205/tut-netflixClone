import { LogOut, Menu, Search } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authUser'
import { useContentStore } from '../store/content'

const Navbar = () => {
    const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false)

    const { user, logout } = useAuthStore()

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
    
    const  { setContentType } = useContentStore()

  return (
    <header className='max-w-6xl flex items-center justify-between mx-auto flex-wrap p-4 h-20'>
        <div className="flex items-center gap-10 z-50">
            <Link to={"/"} className=''>
                <img src="/netflix-logo.png" alt="Netflix logo" className="w-32 sm:w-40" />
            </Link>
            {/* desktop navbar items */}
            <div className="hidden sm:flex gap-2 items-center">
                <Link to="/" className="hover:underline" onClick={() => setContentType('movie')}>Movies</Link>
                <Link to="/" className="hover:underline" onClick={() => setContentType('tv')}>TV Shows</Link>
                <Link to="/history" className="hover:underline">Search History</Link>
            </div>
        </div>

        <div className="flex gap-2 items-center z-50">
            <Link to={'/search'}>
                <Search className='size-6 cursor-pointer'/>
            </Link>
            <img src={user.image} alt="avatar" className="h-8 rounded cursor-pointer" />
            <LogOut className='size-6 cursor-pointer' onClick={logout} />

            <div className="sm:hidden">
                <Menu className='size-6 cursor-pointer' onClick={toggleMobileMenu}/>
            </div>
        </div>

        {/* mobile navbar items */}
        {isMobileMenuOpen && (
            <div className="w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800">
                <Link to="/" className="block p-2 hover:underline" onClick={() => setContentType('movie')}>Movies</Link>
                <Link to="/" className="block p-2 hover:underline" onClick={() => setContentType('tv')}>TV Shows</Link>
                <Link to="/history" className="block p-2 hover:underline">Search History</Link>
            </div>
        )}
    </header>
  )
}

export default Navbar
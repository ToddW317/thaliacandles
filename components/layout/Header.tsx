'use client'

import Link from 'next/link'
import NavbarAuth from './NavbarAuth'

export default function Header() {
  return (
    <header className="bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="font-playfair text-2xl">
              Thalia's Candles
            </Link>
          </div>
          <div className="ml-10 space-x-8">
            <Link
              href="/shop"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Contact
            </Link>
            <NavbarAuth />
          </div>
        </div>
      </nav>
    </header>
  )
} 
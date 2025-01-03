'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function VideoHero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoadedData={() => setIsLoaded(true)}
        >
          <source src="/images/6747437-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center text-center">
        <div className="max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Handcrafted Candles with Love
          </h1>
          <p className="mt-6 text-xl text-white">
            Discover our collection of artisanal candles made with natural ingredients
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/shop"
              className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/collections"
              className="rounded-md border border-white px-6 py-3 text-lg font-semibold text-white hover:bg-white/10 transition-colors"
            >
              View Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
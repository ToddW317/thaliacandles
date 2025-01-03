'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { checkAdminStatus } from '@/lib/auth'
import Cookies from 'js-cookie'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email)
      setUser(user)
      
      if (user) {
        const adminStatus = await checkAdminStatus(user)
        console.log('Admin status:', adminStatus)
        setIsAdmin(adminStatus)
        
        if (adminStatus) {
          const token = await user.getIdToken()
          Cookies.set('admin-token', token)
          console.log('Admin token set')
        } else {
          Cookies.remove('admin-token')
          console.log('Admin token removed')
        }
      } else {
        setIsAdmin(false)
        Cookies.remove('admin-token')
        console.log('User logged out, admin token removed')
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 
import { auth, db } from './firebase'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import Cookies from 'js-cookie'

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    // Get the ID token and set it as a cookie
    const token = await userCredential.user.getIdToken()
    Cookies.set('session', token, { secure: true, sameSite: 'strict' })
    
    const userDocRef = doc(db, 'users', userCredential.user.uid)
    const userDoc = await getDoc(userDocRef)
    
    if (!userDoc.exists()) {
      console.error('User document not found')
      await firebaseSignOut(auth)
      Cookies.remove('session')
      throw new Error('User not found in database')
    }

    const userData = userDoc.data()
    if (userData.role !== 'admin') {
      console.error('User is not an admin')
      await firebaseSignOut(auth)
      Cookies.remove('session')
      throw new Error('Unauthorized access')
    }

    return userCredential.user
  } catch (error: any) {
    console.error('Sign in error:', error)
    if (error.code === 'permission-denied') {
      throw new Error('Database access denied. Please check Firestore rules.')
    }
    throw new Error(error.message || 'An error occurred during sign in')
  }
}

export async function createAdminUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Create user document with admin role
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      role: 'admin',
      createdAt: new Date().toISOString()
    })

    return userCredential.user
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth)
    Cookies.remove('session')
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function checkAdminStatus(user: User): Promise<boolean> {
  try {
    console.log('Checking admin status for:', user.email)
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)
    
    if (!userDoc.exists()) {
      console.log('User document not found')
      return false
    }

    const isAdmin = userDoc.data().role === 'admin'
    console.log('Admin status result:', isAdmin)
    return isAdmin
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
} 
import { adminAuth, adminDb } from './firebase-admin'

async function addAdmin(email: string, password: string) {
  try {
    // Create user in Authentication
    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: true
    })

    // Add user document with admin role
    await adminDb.collection('users').doc(userRecord.uid).set({
      email,
      role: 'admin',
      createdAt: new Date().toISOString()
    })

    console.log('Admin user created successfully:', userRecord.uid)
  } catch (error) {
    console.error('Error creating admin:', error)
  }
}

// Usage
addAdmin('wooten00@gmail.com', 'your-password-here') 
import { adminAuth, adminDb } from './firebase-admin'

async function createFirstAdmin() {
  try {
    // Create the user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: 'wooten00@gmail.com',
      password: 'admin123',
      emailVerified: true
    })

    // Create the user document in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      email: userRecord.email,
      role: 'admin',
      createdAt: new Date().toISOString()
    })

    console.log('Admin user created successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  }
}

createFirstAdmin() 
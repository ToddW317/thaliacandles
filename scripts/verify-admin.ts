import { adminAuth, adminDb } from './firebase-admin'

async function verifyAdmin(email: string) {
  try {
    // Get user by email
    const userRecord = await adminAuth.getUserByEmail(email)
    console.log('User exists in Auth:', userRecord.uid)

    // Check user document
    const userDoc = await adminDb.collection('users').doc(userRecord.uid).get()
    if (!userDoc.exists) {
      console.log('User document missing - creating it now...')
      await adminDb.collection('users').doc(userRecord.uid).set({
        email: userRecord.email,
        role: 'admin',
        createdAt: new Date().toISOString()
      })
      console.log('Created user document with admin role')
    } else {
      console.log('User document exists:', userDoc.data())
    }
  } catch (error) {
    console.error('Error verifying admin:', error)
  }
}

// Run the verification
verifyAdmin('wooten00@gmail.com') 
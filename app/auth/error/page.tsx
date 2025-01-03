import Link from 'next/link'

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="font-playfair text-3xl mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-8">
          There was a problem signing you in. Please try again.
        </p>
        <Link
          href="/auth/signin"
          className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  )
} 
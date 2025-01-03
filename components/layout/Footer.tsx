import Link from 'next/link'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <h3 className="font-playfair font-semibold mb-4">Thalia's Candles</h3>
            <p className="text-gray-600 text-sm">
              Handcrafted candles made with love and natural ingredients.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-gray-900">Home</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gray-900">Shop</Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-gray-900">Collections</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gray-900">About</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/shipping" className="hover:text-gray-900">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-gray-900">Returns & Refunds</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gray-900">FAQ</Link>
              </li>
              <li>
                <Link href="/care" className="hover:text-gray-900">Candle Care</Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: hello@thaliascandles.com</li>
              <li>Phone: (555) 123-4567</li>
              <li className="pt-4">
                <p className="mb-2">Subscribe to our newsletter:</p>
                <form className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-3 py-1 text-sm border rounded-md flex-grow"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800"
                  >
                    Sign Up
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Thalia's Candles. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 
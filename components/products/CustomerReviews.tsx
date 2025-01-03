import { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Review {
  id: string
  userName: string
  rating: number
  comment: string
}

interface CustomerReviewsProps {
  productId: string
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsRef = collection(db, 'reviews')
      const q = query(reviewsRef, where('productId', '==', productId))
      const querySnapshot = await getDocs(q)
      const reviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[]
      setReviews(reviewsData)
    }

    fetchReviews()
  }, [productId])

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div key={review.id} className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold">{review.userName}</h3>
          <p className="text-sm text-gray-600">Rating: {review.rating}/5</p>
          <p className="mt-2 text-gray-800">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}

export default CustomerReviews 
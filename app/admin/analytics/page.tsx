'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface AnalyticsData {
  revenueByDay: { [key: string]: number }
  topProducts: { name: string; revenue: number }[]
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    revenueByDay: {},
    topProducts: [],
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Get orders from the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const ordersRef = collection(db, 'orders')
      const q = query(
        ordersRef,
        where('createdAt', '>=', thirtyDaysAgo),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      
      const revenueByDay: { [key: string]: number } = {}
      const productRevenue: { [key: string]: number } = {}
      let totalRevenue = 0
      
      snapshot.docs.forEach(doc => {
        const order = doc.data()
        const date = new Date(order.createdAt.toDate()).toLocaleDateString()
        
        // Aggregate revenue by day
        revenueByDay[date] = (revenueByDay[date] || 0) + order.total
        
        // Aggregate revenue by product
        order.items.forEach((item: any) => {
          productRevenue[item.name] = (productRevenue[item.name] || 0) + (item.price * item.quantity)
        })
        
        totalRevenue += order.total
      })

      // Sort products by revenue and get top 5
      const topProducts = Object.entries(productRevenue)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([name, revenue]) => ({ name, revenue: revenue as number }))

      setData({
        revenueByDay,
        topProducts,
        totalRevenue,
        totalOrders: snapshot.docs.length,
        averageOrderValue: totalRevenue / snapshot.docs.length || 0,
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const revenueChartData = {
    labels: Object.keys(data.revenueByDay),
    datasets: [
      {
        label: 'Daily Revenue',
        data: Object.values(data.revenueByDay),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.3,
      },
    ],
  }

  const productChartData = {
    labels: data.topProducts.map(p => p.name),
    datasets: [
      {
        data: data.topProducts.map(p => p.revenue),
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  }

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of your store's performance in the last 30 days.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              ${data.totalRevenue.toFixed(2)}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{data.totalOrders}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Average Order Value</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              ${data.averageOrderValue.toFixed(2)}
            </dd>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Over Time</h3>
          <Line data={revenueChartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products by Revenue</h3>
          <Doughnut data={productChartData} />
        </div>
      </div>
    </div>
  )
} 
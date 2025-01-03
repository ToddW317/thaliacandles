'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import {
  ShoppingBagIcon,
  CubeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  totalRevenue: number
  recentOrders: any[]
  percentageChanges: {
    revenue: number
    orders: number
    customers: number
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
    percentageChanges: {
      revenue: 0,
      orders: 0,
      customers: 0,
    },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch products count
      const productsSnapshot = await getDocs(collection(db, 'products'))
      const totalProducts = productsSnapshot.size

      // Fetch orders
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const ordersSnapshot = await getDocs(ordersQuery)
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Calculate total revenue and get recent orders
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
      const recentOrders = orders.slice(0, 5)

      // Fetch customers count
      const customersSnapshot = await getDocs(collection(db, 'users'))
      const totalCustomers = customersSnapshot.size

      // Calculate percentage changes (mock data - you can implement real calculations)
      const percentageChanges = {
        revenue: 12.5,
        orders: 8.2,
        customers: 15.3,
      }

      setStats({
        totalProducts,
        totalOrders: orders.length,
        totalCustomers,
        totalRevenue,
        recentOrders,
        percentageChanges,
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Total Products',
      value: stats.totalProducts,
      change: null,
      icon: CubeIcon,
      onClick: () => router.push('/admin/products'),
      iconBackground: 'bg-blue-500',
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders,
      change: `${stats.percentageChanges.orders > 0 ? '+' : ''}${stats.percentageChanges.orders}%`,
      icon: ShoppingBagIcon,
      onClick: () => router.push('/admin/orders'),
      iconBackground: 'bg-purple-500',
    },
    {
      name: 'Total Customers',
      value: stats.totalCustomers,
      change: `${stats.percentageChanges.customers > 0 ? '+' : ''}${stats.percentageChanges.customers}%`,
      icon: UserGroupIcon,
      onClick: () => router.push('/admin/customers'),
      iconBackground: 'bg-green-500',
    },
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      change: `${stats.percentageChanges.revenue > 0 ? '+' : ''}${stats.percentageChanges.revenue}%`,
      icon: CurrencyDollarIcon,
      onClick: () => router.push('/admin/analytics'),
      iconBackground: 'bg-yellow-500',
    },
  ]

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of your store's performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <button
            key={item.name}
            onClick={item.onClick}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow transition-transform hover:scale-105 hover:shadow-lg sm:p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon 
                  className={`h-12 w-12 p-2 rounded-lg text-white ${item.iconBackground}`} 
                  aria-hidden="true" 
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                  {item.change && (
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      parseFloat(item.change) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {parseFloat(item.change) >= 0 ? (
                        <ArrowUpIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {parseFloat(item.change) >= 0 ? 'Increased' : 'Decreased'} by
                      </span>
                      {item.change}
                    </div>
                  )}
                </dd>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {stats.recentOrders.map((order) => (
              <li key={order.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(order.createdAt.toDate(), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </p>
                    <button
                      onClick={() => router.push(`/admin/orders?id=${order.id}`)}
                      className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 
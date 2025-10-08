import { useState, useEffect, useCallback } from 'react'
import { notificationsApi } from '@/lib/api'
import { Notification } from '@/types'

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  refreshUnreadCount: () => Promise<void>
}

export function useNotifications(userId?: string): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await notificationsApi.getAll({ page: 1, limit: 20 })
      setNotifications((data as { notifications?: Notification[] }).notifications || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const refreshUnreadCount = useCallback(async () => {
    if (!userId) return
    
    try {
      const data = await notificationsApi.getUnreadCount()
      setUnreadCount((data as { count?: number }).count || 0)
    } catch (err) {
      console.error('Error fetching unread count:', err)
    }
  }, [userId])

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationsApi.markAsRead(id)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id 
            ? { ...notif, isRead: true }
            : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read')
      console.error('Error marking notification as read:', err)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllAsRead()
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      )
      setUnreadCount(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read')
      console.error('Error marking all notifications as read:', err)
    }
  }, [])

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationsApi.delete(id)
      const deletedNotif = notifications.find(notif => notif.id === id)
      setNotifications(prev => prev.filter(notif => notif.id !== id))
      
      // Update unread count if the deleted notification was unread
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification')
      console.error('Error deleting notification:', err)
    }
  }, [notifications])

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchNotifications()
      refreshUnreadCount()
    }
  }, [userId, fetchNotifications, refreshUnreadCount])

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!userId) return

    const interval = setInterval(() => {
      refreshUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [userId, refreshUnreadCount])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshUnreadCount,
  }
}

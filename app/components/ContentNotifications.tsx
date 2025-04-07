'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import Link from 'next/link';

type ContentNotification = {
  notification_id: number;
  content_id: number;
  title: string;
  created_at: string;
  is_sent: boolean;
};

export default function ContentNotifications() {
  const [notifications, setNotifications] = useState<ContentNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/educational-content/notifications');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5*60*1000);
    return () => clearInterval(interval);
  }, []);

  const markAsSent = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/educational-content/notifications/${notificationId}/mark-sent`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update notification');
      }
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.notification_id === notificationId 
          ? { ...notification, is_sent: true } 
          : notification
      ));
    } catch (error) {
      console.error('Error updating notification:', error);
      toast.error('Failed to mark notification as sent');
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.is_sent).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-3 px-1.5 py-0.5 text-xs">
            {unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="px-3 py-2 text-sm font-medium border-b">
          Educational Content Updates
        </div>
        <div className="max-h-64 overflow-auto">
          {loading ? (
            <div className="p-3 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-3 text-center text-sm text-muted-foreground">
              No new educational content updates
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.notification_id} className="cursor-pointer">
                <Link 
                  href={`/educational-content/${notification.content_id}`}
                  className="flex flex-col w-full"
                  onClick={() => !notification.is_sent && markAsSent(notification.notification_id)}
                >
                  <span className="font-medium">
                    {!notification.is_sent && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                    )}
                    {notification.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
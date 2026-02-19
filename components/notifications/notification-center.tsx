"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  Bell,
  BellRing,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Settings,
  Trash2,
  Eye,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  AlertCircle,
  Check,
  Filter
} from "lucide-react";

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
  category: 'seo' | 'performance' | 'security' | 'general' | 'ai' | 'monitoring';
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      // Check if token exists
      if (!token) {
        console.log('No auth token found');
        return;
      }
      
      // Basic token format validation (JWT should have 3 parts separated by dots)
      if (token.split('.').length !== 3) {
        console.log('Invalid token format, removing from localStorage');
        localStorage.removeItem('auth_token');
        return;
      }
      
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else if (response.status === 401) {
        // Token is invalid or expired, remove it
        console.log('Invalid or expired token, removing from localStorage');
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Check if token exists
      if (!token) {
        console.log('No auth token found');
        return;
      }
      
      // Basic token format validation
      if (token.split('.').length !== 3) {
        console.log('Invalid token format, removing from localStorage');
        localStorage.removeItem('auth_token');
        return;
      }
      
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
      } else if (response.status === 401) {
        // Token is invalid or expired, remove it
        console.log('Invalid or expired token, removing from localStorage');
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Check if token exists
      if (!token) {
        console.log('No auth token found');
        return;
      }
      
      // Basic token format validation
      if (token.split('.').length !== 3) {
        console.log('Invalid token format, removing from localStorage');
        localStorage.removeItem('auth_token');
        return;
      }
      
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        );
      } else if (response.status === 401) {
        // Token is invalid or expired, remove it
        console.log('Invalid or expired token, removing from localStorage');
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setNotifications(prev =>
          prev.filter(n => n.id !== notificationId)
        );
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/notifications/clear-all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'seo':
        return <TrendingUp className="h-4 w-4" />;
      case 'performance':
        return <Zap className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'ai':
        return <BellRing className="h-4 w-4" />;
      case 'monitoring':
        return <Eye className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'seo':
        return 'bg-blue-100 text-blue-800';
      case 'performance':
        return 'bg-orange-100 text-orange-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'ai':
        return 'bg-purple-100 text-purple-800';
      case 'monitoring':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.category === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <GlassCard
        className="w-full max-w-md max-h-[80vh] overflow-hidden relative z-10"
      >
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="seo">SEO</option>
                <option value="performance">Performance</option>
                <option value="security">Security</option>
                <option value="ai">AI</option>
                <option value="monitoring">Monitoring</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
                <Trash2 className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={`text-xs ${getCategoryColor(notification.category)}`}>
                            {getCategoryIcon(notification.category)}
                            <span className="ml-1">{notification.category}</span>
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      {notification.action && (
                        <GradientButton
                          size="sm"
                          onClick={() => {
                            window.location.href = notification.action!.url;
                            markAsRead(notification.id);
                          }}
                          className="text-xs"
                        >
                          {notification.action.label}
                        </GradientButton>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardHeader className="border-t">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="text-xs">
              <Settings className="h-4 w-4 mr-1" />
              Notification Settings
            </Button>
            <Button variant="ghost" size="sm" className="text-xs" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
      </GlassCard>
    </div>
  );
}

export default NotificationCenter;
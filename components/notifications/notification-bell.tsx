"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellRing } from "lucide-react";
import NotificationCenter from "./notification-center";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
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
      
      const response = await fetch('/api/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      } else if (response.status === 401) {
        // Token is invalid or expired, remove it
        console.log('Invalid or expired token, removing from localStorage');
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchUnreadCount();
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleNotifications}
        className="relative p-2"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-5 w-5" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      <NotificationCenter
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          fetchUnreadCount();
        }}
      />
    </>
  );
}

export default NotificationBell;
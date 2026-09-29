import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatDateTime } from '@/lib/utils';
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  CreditCard,
  User,
  Inbox,
  Sparkles,
  CheckCheck,
  Calendar,
} from 'lucide-react';

const NOTIFICATION_CATEGORIES = {
  REQUEST: { label: 'School Inquiry', icon: Inbox, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  PLAN: { label: 'Plan & Billing', icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
  SYSTEM: { label: 'System Notice', icon: Info, color: 'text-slate-600', bg: 'bg-slate-500/10' },
  PROFILE: { label: 'Profile Update', icon: User, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
};

export default function ApplicantNotifications() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('ALL');

  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications().then((r) => r.data),
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification._id);
    }
  };

  const getCategory = (notification) => {
    const type = notification.type || 'SYSTEM';
    return NOTIFICATION_CATEGORIES[type] || NOTIFICATION_CATEGORIES.SYSTEM;
  };

  const notifications = data?.data || [];
  const unreadCount = data?.unreadCount || 0;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'REQUEST') return n.type === 'REQUEST';
    if (filter === 'PLAN') return n.type === 'PLAN';
    return true;
  });

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white max-w-6xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Notifications & Alerts"
          description="Stay updated with school inquiries, interview invitations, and membership activity"
        />

        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="h-9 px-4 rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold shrink-0 self-start sm:self-auto flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <CheckCheck className="h-4 w-4 text-blue-600" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setFilter('ALL')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Alerts ({notifications.length})
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setFilter('UNREAD')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'UNREAD'
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setFilter('REQUEST')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'REQUEST'
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            School Inquiries
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setFilter('PLAN')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'PLAN'
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Plans & Credits
          </Button>
        </div>

        <span className="text-xs text-slate-400 pr-2">
          {unreadCount > 0 ? `${unreadCount} unread message(s)` : 'All caught up!'}
        </span>
      </div>

      {/* Notifications List */}
      <Card className="border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin mb-3" />
              <p className="text-xs text-slate-400 font-semibold">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 p-4 text-center">
              <AlertCircle className="h-10 w-10 text-rose-500 mb-2" />
              <p className="text-sm font-bold text-rose-600">Failed to load notifications</p>
              <Button
                variant="outline"
                className="mt-3 rounded-xl text-xs font-semibold"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['notifications'] })}
              >
                Retry
              </Button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 p-6 text-center">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Notifications Here
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                When schools view your profile, send requests, or your subscription updates, notifications will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredNotifications.map((n) => {
                const cat = getCategory(n);
                const Icon = cat.icon;
                return (
                  <div
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                      n.isRead
                        ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        : 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/30'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${cat.bg} ${cat.color} mt-0.5`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {cat.label}
                          </Badge>
                          {!n.isRead && (
                            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium shrink-0">
                          {formatDateTime(n.createdAt)}
                        </span>
                      </div>

                      <h4 className={`text-sm ${n.isRead ? 'font-semibold text-slate-800 dark:text-slate-200' : 'font-extrabold text-slate-900 dark:text-white'}`}>
                        {n.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

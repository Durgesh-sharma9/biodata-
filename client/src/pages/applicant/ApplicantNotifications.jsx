import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Bell, AlertCircle, CheckCircle, Info, CreditCard, User } from 'lucide-react';

const NOTIFICATION_CATEGORIES = {
  REQUEST: { label: 'Request', icon: Bell, color: 'bg-blue-600' },
  PLAN: { label: 'Plan', icon: CreditCard, color: 'bg-purple-600' },
  SYSTEM: { label: 'System', icon: Info, color: 'bg-slate-500' },
  PROFILE: { label: 'Profile', icon: User, color: 'bg-emerald-600' },
};

export default function ApplicantNotifications() {
  const queryClient = useQueryClient();

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

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white">
      <PageHeader
        title="Notifications"
        description="Stay updated with your account activity"
        action={
          data?.unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={() => markAllMutation.mutate()} className="rounded-lg border-slate-200 hover:bg-slate-50 hover:text-purple-600">
              Mark all read
            </Button>
          ) : null
        }
      />

      <Card className="border border-slate-200/60 bg-white shadow-2xs dark:bg-slate-900">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-slate-400 dark:text-slate-500">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-rose-600 mb-4" />
              <p className="text-rose-600 font-bold">Failed to load notifications</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Please try again later</p>
              <Button variant="outline" className="mt-4 rounded-lg border-slate-200 hover:bg-slate-50" onClick={() => queryClient.invalidateQueries({ queryKey: ['notifications'] })}>
                Retry
              </Button>
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-800 text-slate-400 mb-4">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Notifications Yet</h3>
              <p className="text-slate-400 dark:text-slate-500 text-center max-w-md mb-6">
                You will receive notifications when:
              </p>
              <ul className="text-sm text-slate-400 dark:text-slate-500 space-y-2 text-left max-w-md">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Schools show interest in your profile
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Schools send requests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Requests are unlocked
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Plans are purchased
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Plans expire
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Important account updates occur
                </li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              {data.data.map((notification) => {
                const category = getCategory(notification);
                const CategoryIcon = category.icon;
                return (
                  <div
                    key={notification._id}
                    className={`rounded-lg border p-4 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/30 ${
                      !notification.isRead ? 'bg-slate-50/50 border-l-4 border-l-purple-600 dark:bg-slate-900/30' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${category.color} text-white`}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {category.label}
                          </Badge>
                          {!notification.isRead && (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200/60">New</Badge>
                          )}
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{notification.title}</p>
                        <p className="text-sm mt-1 text-slate-400 dark:text-slate-500">{notification.message}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1">
                          {formatDateTime(notification.createdAt)}
                        </p>
                      </div>
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

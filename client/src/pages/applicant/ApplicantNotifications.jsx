import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Bell, AlertCircle, CheckCircle, Info, CreditCard, User } from 'lucide-react';

const NOTIFICATION_CATEGORIES = {
  REQUEST: { label: 'Request', icon: Bell, color: 'bg-blue-500' },
  PLAN: { label: 'Plan', icon: CreditCard, color: 'bg-purple-500' },
  SYSTEM: { label: 'System', icon: Info, color: 'bg-gray-500' },
  PROFILE: { label: 'Profile', icon: User, color: 'bg-green-500' },
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
    <div>
      <PageHeader
        title="Notifications"
        description="Stay updated with your account activity"
        action={
          data?.unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={() => markAllMutation.mutate()}>
              Mark all read
            </Button>
          ) : null
        }
      />

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-destructive font-medium">Failed to load notifications</p>
              <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
              <Button variant="outline" className="mt-4" onClick={() => queryClient.invalidateQueries({ queryKey: ['notifications'] })}>
                Retry
              </Button>
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">🔔 No Notifications Yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                You will receive notifications when:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Schools show interest in your profile
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Schools send requests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Requests are unlocked
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Plans are purchased
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Plans expire
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
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
                    className={`rounded-lg border p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                      !notification.isRead ? 'bg-muted/30 border-l-4 border-l-primary' : ''
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
                            <Badge variant="default">New</Badge>
                          )}
                        </div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm mt-1 text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
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

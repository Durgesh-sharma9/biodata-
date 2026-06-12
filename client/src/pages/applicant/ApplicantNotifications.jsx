import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function ApplicantNotifications() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
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

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="In-app notifications"
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
            <p className="text-center py-8">Loading...</p>
          ) : data?.data?.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No notifications</p>
          ) : (
            <div className="space-y-3">
              {data.data.map((notification) => (
                <div
                  key={notification._id}
                  className={`rounded-lg border p-4 ${!notification.isRead ? 'bg-muted/30' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Badge>New</Badge>
                    )}
                  </div>
                  {!notification.isRead && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2"
                      onClick={() => markReadMutation.mutate(notification._id)}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

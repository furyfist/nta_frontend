import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const NotificationsPage = () => {
  const { notifications, markNotificationRead, currentRole } = useApp();

  const userNotifications = notifications.filter(n =>
    n.recipients.includes('all') || n.recipients.includes(currentRole || '')
  );

  return (
    <Layout title="Notifications">
      <div className="space-y-4">
        {userNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No notifications</p>
            </CardContent>
          </Card>
        ) : (
          userNotifications.map(notification => (
            <Card key={notification.id} className={!notification.read ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{notification.title}</CardTitle>
                      {!notification.read && <Badge>New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(notification.date).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p>{notification.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage;

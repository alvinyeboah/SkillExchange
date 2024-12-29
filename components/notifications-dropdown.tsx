import { Bell, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useNotifications } from "@/hooks/use-notifications";

export function NotificationsDropdown() {
  const {
    notifications,
    reminders,
    isLoading,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
  } = useNotifications();
  const { user } = useAuth();

  if (!user) return null;

  const unreadCount = getUnreadCount();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card>
          <CardContent className="p-0">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsRead(user.user_id)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark all as read
                </Button>
              )}
            </div>
            <ScrollArea className="h-[400px]">
              {[...notifications, ...reminders]
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .map((item) => (
                  <div
                    key={item.notification_id}
                    className={`p-4 border-b last:border-b-0 ${
                      item.status === "read" ? "bg-muted/50" : "bg-background"
                    } hover:bg-accent transition-colors`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 rounded-full p-2">
                        {item.type === "email"
                          ? "📧"
                          : item.type === "push"
                          ? "🔔"
                          : "🔔"}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{item.title}</h4>
                          <Badge
                            variant={
                              item.status === "read" ? "secondary" : "default"
                            }
                          >
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Reference #{item.reference_id}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {formatDistanceToNow(new Date(item.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0"
                          >
                            View <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

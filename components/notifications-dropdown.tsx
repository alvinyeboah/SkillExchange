import { Bell, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useReminders } from "@/hooks/use-reminders-store";
import { format, formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState } from "react";

export function NotificationsDropdown() {
  const { reminders, isLoading, error } = useReminders();
  const { user } = useAuth();
  if (!user) return null;

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="relative opacity-50">
        <Bell className="h-auto w-[1.2rem]" />
      </Button>
    );
  }

  if (error) {
    return null;
  }

  const unreadCount = reminders.filter((reminder) => !reminder.notified).length

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MMM d, yyyy h:mm a")

  }

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case "challenge":
        return "🏆"
      default:
        return "🔔"
    }
  }

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
        <span className="sr-only">Notifications</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-80 p-0">
      <Card>
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => {

              }}>
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>
          <ScrollArea className="h-[400px]">
            {reminders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No reminders set
              </p>
            ) : (
              reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-4 border-b last:border-b-0 ${
                    reminder.notified ? "bg-muted/50" : "bg-background"
                  } hover:bg-accent transition-colors`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      {getNotificationTypeIcon(reminder.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{reminder.title}</h4>
                        <Badge variant={reminder.notified ? "secondary" : "default"}>
                          {reminder.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Reference #{reminder.reference_id}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDistanceToNow(new Date(reminder.datetime), { addSuffix: true })}</span>
                        <Button variant="ghost" size="sm" className="h-auto p-0">
                          View <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </PopoverContent>
  </Popover>
  );
}

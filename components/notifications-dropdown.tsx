import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useReminders } from "@/hooks/use-reminders-store";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";

export function NotificationsDropdown() {
  const { reminders, isLoading, error } = useReminders();
  const { user } = useAuth();
  const unreadCount =
    reminders?.filter((reminder) => !reminder.notified).length || 0;

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

  const formatReminderDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  };

  const getReminderTypeIcon = (type: "challenge" | "event") => {
    switch (type) {
      case "challenge":
        return "🏆";
      case "event":
        return "📅";
      default:
        return "🔔";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-auto w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 h-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Reminders</h3>
          <Button variant="ghost" size="sm">
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-80">
          {reminders.map((reminder, index: number) => (
            <div key={reminder.id}>
              {index > 0 && <Separator className="my-2" />}
              <div className={`p-2 ${reminder.notified ? "opacity-60" : ""}`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium flex items-center">
                    <span className="mr-2">
                      {getReminderTypeIcon(reminder.type)}
                    </span>
                    {reminder.title}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {formatReminderDate(reminder.datetime)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {reminder.type.charAt(0).toUpperCase() +
                    reminder.type.slice(1)}{" "}
                  #{reminder.id}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

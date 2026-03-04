import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalEvent {
  date: number;
  title: string;
  type: "appointment" | "meeting" | "reminder";
}

const events: CalEvent[] = [
  { date: 3, title: "Dr. Ochieng - Checkups", type: "appointment" },
  { date: 4, title: "Staff Meeting", type: "meeting" },
  { date: 4, title: "Jane Mwangi Follow-up", type: "appointment" },
  { date: 7, title: "Lab Equipment Maintenance", type: "reminder" },
  { date: 10, title: "Dr. Njeri Consultations", type: "appointment" },
  { date: 12, title: "Pharmacy Restock", type: "reminder" },
  { date: 15, title: "Board Meeting", type: "meeting" },
  { date: 20, title: "Dr. Kipchoge Surgeries", type: "appointment" },
  { date: 25, title: "Monthly Report Due", type: "reminder" },
];

const typeColors: Record<string, string> = {
  appointment: "bg-primary/20 text-primary",
  meeting: "bg-accent/20 text-accent",
  reminder: "bg-warning/20 text-warning",
};

export default function CalendarPage() {
  const [currentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="font-display text-lg">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {daysOfWeek.map((d) => (
              <div key={d} className="bg-muted/50 p-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
            ))}
            {cells.map((day, i) => {
              const dayEvents = day ? events.filter((e) => e.date === day) : [];
              return (
                <div
                  key={i}
                  className={`bg-card min-h-[80px] md:min-h-[100px] p-1.5 ${day === today ? "ring-2 ring-primary ring-inset" : ""} ${!day ? "bg-muted/20" : "hover:bg-muted/30 cursor-pointer transition-colors"}`}
                >
                  {day && (
                    <>
                      <span className={`text-xs font-medium ${day === today ? "text-primary font-bold" : "text-foreground"}`}>{day}</span>
                      <div className="mt-1 space-y-0.5">
                        {dayEvents.slice(0, 2).map((ev, j) => (
                          <div key={j} className={`text-[10px] px-1 py-0.5 rounded truncate ${typeColors[ev.type]}`}>
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-primary" /> Appointments</div>
        <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-accent" /> Meetings</div>
        <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-warning" /> Reminders</div>
      </div>
    </div>
  );
}

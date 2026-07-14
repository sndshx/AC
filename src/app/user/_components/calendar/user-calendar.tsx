"use client";

import { useState, useMemo } from "react";
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isToday, isSameDay, addMonths, subMonths,
  startOfWeek, endOfWeek
} from "date-fns";
import { 
  Plus, Clock, Users, Search, Edit, CheckCircle2, Calendar as CalendarIcon,
  ChevronLeft, ChevronRight, X, Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/shared/utils";

// ── Types ──────────────────────────────────────────────────────────────
type EventType = "campaign" | "task" | "meeting" | "deadline";

interface CustomEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: EventType;
  description?: string;
  attendees?: string[];
  status: "pending" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high";
}

// ── Sample Events Data ──────────────────────────────────────────────────
const sampleEvents: CustomEvent[] = [
  {
    id: "1",
    title: "Launch Summer Campaign",
    type: "campaign",
    start: new Date(2026, 6, 10, 9, 0),
    end: new Date(2026, 6, 10, 10, 0),
    description: "Launch summer marketing campaign across all channels",
    status: "pending",
    priority: "high"
  },
  {
    id: "2",
    title: "Team Sync Meeting",
    type: "meeting",
    start: new Date(2026, 6, 10, 14, 0),
    end: new Date(2026, 6, 10, 15, 0),
    description: "Weekly team sync to review campaign progress",
    attendees: ["Team"],
    status: "pending",
    priority: "medium"
  },
  {
    id: "3",
    title: "Complete WhatsApp Templates",
    type: "task",
    start: new Date(2026, 6, 12, 11, 0),
    end: new Date(2026, 6, 12, 12, 0),
    description: "Create and test new WhatsApp message templates",
    status: "pending",
    priority: "high"
  },
  {
    id: "4",
    title: "Campaign Report Due",
    type: "deadline",
    start: new Date(2026, 6, 15, 17, 0),
    end: new Date(2026, 6, 15, 17, 30),
    description: "Submit monthly campaign performance report",
    status: "pending",
    priority: "high"
  },
  {
    id: "5",
    title: "Analyze Email Metrics",
    type: "task",
    start: new Date(2026, 6, 14, 10, 0),
    end: new Date(2026, 6, 14, 11, 30),
    description: "Review and analyze email campaign performance",
    status: "completed",
    priority: "medium"
  },
  {
    id: "6",
    title: "Client Follow-up",
    type: "campaign",
    start: new Date(2026, 6, 18, 15, 0),
    end: new Date(2026, 6, 18, 16, 0),
    description: "Follow up with potential leads",
    status: "pending",
    priority: "medium"
  },
  {
    id: "7",
    title: "Review Campaign Performance",
    type: "meeting",
    start: new Date(2026, 6, 20, 13, 0),
    end: new Date(2026, 6, 20, 14, 0),
    description: "Monthly performance review meeting",
    attendees: ["Manager", "Team Lead"],
    status: "pending",
    priority: "medium"
  },
  {
    id: "8",
    title: "Update SMS Templates",
    type: "task",
    start: new Date(2026, 6, 8, 9, 30),
    end: new Date(2026, 6, 8, 10, 30),
    description: "Update and optimize SMS message templates",
    status: "completed",
    priority: "low"
  }
];

const eventTypeLabels: Record<EventType, string> = {
  campaign: "Campaign",
  task: "Task",
  meeting: "Meeting",
  deadline: "Deadline"
};

// ── Main Component ──────────────────────────────────────────────────────
export function UserCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<EventType | "all">("all");

  // Get calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const filteredEvents = useMemo(() => {
    let filtered = sampleEvents;
    if (filterType !== "all") {
      filtered = filtered.filter(event => event.type === filterType);
    }
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [filterType, searchQuery]);

  const myTasks = useMemo(() => {
    const now = new Date();
    return sampleEvents
      .filter(event => event.type === "task" && event.status === "pending")
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5);
  }, []);

  const monthStats = useMemo(() => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthEvents = sampleEvents.filter(event => 
      event.start.getMonth() === currentMonth && 
      event.start.getFullYear() === currentYear
    );
    return {
      total: monthEvents.length,
      myTasks: monthEvents.filter(e => e.type === "task").length,
      meetings: monthEvents.filter(e => e.type === "meeting").length,
      campaigns: monthEvents.filter(e => e.type === "campaign").length,
      completed: monthEvents.filter(e => e.status === "completed").length
    };
  }, [currentDate]);

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => isSameDay(event.start, day));
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const eventColors: Record<EventType, string> = {
    campaign: "bg-blue-500",
    task: "bg-emerald-500", 
    meeting: "bg-purple-500",
    deadline: "bg-red-500"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/80 to-blue-50/30 px-5 py-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-[#00C853]" />
            My Calendar
          </h1>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">Manage your tasks, meetings, and campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 text-xs px-3 font-semibold"
            onClick={handleToday}
          >
            Today
          </Button>
          <Button
            className="h-8 text-xs px-3 gap-1.5 font-semibold bg-[#00C853] hover:bg-[#00C853]/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3.5 w-3.5 text-[#00C853]" />
              <p className="text-[10px] text-emerald-600 font-medium">My Tasks</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{monthStats.myTasks}</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-3.5 w-3.5 text-purple-600" />
              <p className="text-[10px] text-purple-600 font-medium">Meetings</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">{monthStats.meetings}</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="h-3.5 w-3.5 text-blue-600" />
              <p className="text-[10px] text-blue-600 font-medium">Campaigns</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{monthStats.campaigns}</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#00C853]" />
              <p className="text-[10px] text-slate-500 font-medium">Completed</p>
            </div>
            <p className="text-2xl font-bold text-[#00C853]">{monthStats.completed}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200/60 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search my calendar..."
                className="h-8 pl-8 text-xs"
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {["all", "task", "meeting", "campaign", "deadline"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as EventType | "all")}
                  className={cn(
                    "text-[10px] font-semibold px-3 py-1.5 rounded transition-all capitalize",
                    filterType === type ? "bg-white shadow-sm" : "text-slate-600"
                  )}
                >
                  {type === "all" ? "All" : type + "s"}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Calendar Grid */}
        <Card className="lg:col-span-3 border border-slate-200/60 shadow-lg bg-white">
          <CardContent className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-slate-700" />
              </button>
              
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              
              <button
                onClick={handleNextMonth}
                className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-slate-700" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                <div key={day} className="text-center py-3">
                  <span className="text-sm font-bold text-[#00C853]">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isTodayDate = isToday(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedDate(day);
                      if (dayEvents.length > 0) {
                        setSelectedEvent(dayEvents[0]);
                      }
                    }}
                    className={cn(
                      "aspect-square p-2 rounded-lg border-2 transition-all cursor-pointer",
                      "hover:border-[#00C853] hover:shadow-md",
                      !isCurrentMonth && "bg-slate-50/50 opacity-40",
                      isCurrentMonth && "bg-white border-slate-200",
                      isTodayDate && !isSelected && "border-[#00C853] bg-[#00C853]/5",
                      isSelected && "border-[#00C853] bg-[#00C853]/10 shadow-lg scale-105"
                    )}
                  >
                    <div className="flex flex-col h-full">
                      <span className={cn(
                        "text-base font-bold mb-1",
                        isTodayDate ? "text-white bg-[#00C853] rounded-full w-7 h-7 flex items-center justify-center" : "text-slate-900"
                      )}>
                        {format(day, "d")}
                      </span>
                      
                      {dayEvents.length > 0 && (
                        <div className="flex-1 flex flex-col gap-0.5">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                              }}
                              className={cn(
                                "text-[9px] font-semibold px-1.5 py-0.5 rounded truncate text-white",
                                eventColors[event.type]
                              )}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <span className="text-[8px] text-slate-500 font-semibold">
                              +{dayEvents.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {selectedEvent && (
            <Card className="border border-[#00C853]/30 shadow-lg bg-white">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100 bg-[#00C853]/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-slate-900">Event Details</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-red-50"
                    onClick={() => setSelectedEvent(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{selectedEvent.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={cn(
                      "text-[9px] font-semibold",
                      selectedEvent.type === "campaign" && "bg-blue-100 text-blue-700",
                      selectedEvent.type === "task" && "bg-emerald-100 text-emerald-700",
                      selectedEvent.type === "meeting" && "bg-purple-100 text-purple-700",
                      selectedEvent.type === "deadline" && "bg-red-100 text-red-700"
                    )}>
                      {eventTypeLabels[selectedEvent.type]}
                    </Badge>
                    {selectedEvent.priority && (
                      <Badge className={cn(
                        "text-[9px] font-semibold",
                        selectedEvent.priority === "high" && "bg-red-100 text-red-700",
                        selectedEvent.priority === "medium" && "bg-amber-100 text-amber-700",
                        selectedEvent.priority === "low" && "bg-slate-100 text-slate-700"
                      )}>
                        {selectedEvent.priority}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded">
                    <Clock className="h-3.5 w-3.5 text-[#00C853]" />
                    <span>{format(selectedEvent.start, "MMM dd, yyyy h:mm a")}</span>
                  </div>
                  {selectedEvent.end && (
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded">
                      <Clock className="h-3.5 w-3.5 text-[#00C853]" />
                      <span>to {format(selectedEvent.end, "h:mm a")}</span>
                    </div>
                  )}
                  {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                    <div className="flex items-start gap-2 text-slate-600 bg-slate-50 p-2 rounded">
                      <Users className="h-3.5 w-3.5 mt-0.5 text-[#00C853]" />
                      <span>{selectedEvent.attendees.join(", ")}</span>
                    </div>
                  )}
                </div>
                {selectedEvent.description && (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-[10px] font-semibold text-slate-700 mb-1">Description</p>
                    <p className="text-xs text-slate-600">{selectedEvent.description}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="secondary" size="sm" className="flex-1 h-8 text-xs hover:bg-slate-100">
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  {selectedEvent.status === "pending" && (
                    <Button size="sm" className="flex-1 h-8 text-xs bg-[#00C853] hover:bg-[#00C853]/90">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border border-slate-200/60 shadow-sm bg-white">
            <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="h-4 w-4 text-[#00C853]" />
                My Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {myTasks.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-500">No pending tasks</p>
                </div>
              ) : (
                myTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedEvent(task)}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-[#00C853]/20"
                  >
                    <div className="h-2.5 w-2.5 rounded-full flex-shrink-0 mt-1.5 bg-emerald-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-slate-500">
                          {format(task.start, "MMM dd")} • {format(task.start, "h:mm a")}
                        </p>
                        {task.priority && (
                          <Badge className={cn(
                            "text-[8px] px-1 py-0",
                            task.priority === "high" && "bg-red-100 text-red-700",
                            task.priority === "medium" && "bg-amber-100 text-amber-700",
                            task.priority === "low" && "bg-slate-100 text-slate-700"
                          )}>
                            {task.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border border-slate-200/60 shadow-sm bg-gradient-to-br from-white to-slate-50">
            <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Event Types</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-emerald-500 shadow-sm" />
                  <span className="text-xs font-semibold text-slate-700">Task</span>
                </div>
                <span className="text-xs font-bold text-emerald-600">{monthStats.myTasks}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50/50">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-purple-500 shadow-sm" />
                  <span className="text-xs font-semibold text-slate-700">Meeting</span>
                </div>
                <span className="text-xs font-bold text-purple-600">{monthStats.meetings}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-blue-500 shadow-sm" />
                  <span className="text-xs font-semibold text-slate-700">Campaign</span>
                </div>
                <span className="text-xs font-bold text-blue-600">{monthStats.campaigns}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-red-50/50">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-red-500 shadow-sm" />
                  <span className="text-xs font-semibold text-slate-700">Deadline</span>
                </div>
                <span className="text-xs font-bold text-red-600">
                  {sampleEvents.filter(e => e.type === "deadline" && 
                    e.start.getMonth() === currentDate.getMonth() && 
                    e.start.getFullYear() === currentDate.getFullYear()).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

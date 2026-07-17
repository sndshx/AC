"use client";

import { useState, useMemo } from "react";
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isToday, isSameDay, addMonths, subMonths,
  startOfWeek, endOfWeek
} from "date-fns";
import { 
  Plus, Clock, Users, Search, Edit, CheckCircle2, Calendar as CalendarIcon,
  ChevronLeft, ChevronRight, X
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
}

// ── Sample Events Data ──────────────────────────────────────────────────
const sampleEvents: CustomEvent[] = [
  {
    id: "1",
    title: "Summer Campaign Launch",
    type: "campaign",
    start: new Date(2026, 6, 10, 9, 0),
    end: new Date(2026, 6, 10, 10, 0),
    description: "Launch summer marketing campaign across all channels",
    attendees: ["Sarah J.", "Mike C."],
    status: "pending"
  },
  {
    id: "2",
    title: "Weekly Team Meeting",
    type: "meeting",
    start: new Date(2026, 6, 10, 14, 0),
    end: new Date(2026, 6, 10, 15, 0),
    description: "Review campaign performance and strategy",
    attendees: ["Sarah J.", "Mike C.", "Emma D.", "Alex K."],
    status: "pending"
  },
  {
    id: "3",
    title: "WhatsApp Template Review",
    type: "task",
    start: new Date(2026, 6, 12, 11, 0),
    end: new Date(2026, 6, 12, 12, 0),
    description: "Review and approve new WhatsApp templates",
    status: "pending"
  },
  {
    id: "4",
    title: "Q3 Report Deadline",
    type: "deadline",
    start: new Date(2026, 6, 15, 17, 0),
    end: new Date(2026, 6, 15, 17, 30),
    description: "Submit quarterly marketing performance report",
    status: "pending"
  },
  {
    id: "5",
    title: "Email Campaign Analysis",
    type: "task",
    start: new Date(2026, 6, 14, 10, 0),
    end: new Date(2026, 6, 14, 11, 30),
    description: "Analyze email campaign metrics and optimize",
    status: "completed"
  },
  {
    id: "6",
    title: "Client Follow-up Campaign",
    type: "campaign",
    start: new Date(2026, 6, 18, 15, 0),
    end: new Date(2026, 6, 18, 16, 0),
    description: "Follow-up campaign for cold leads",
    attendees: ["Lisa W."],
    status: "pending"
  },
  {
    id: "7",
    title: "AI Insights Review",
    type: "meeting",
    start: new Date(2026, 6, 20, 13, 0),
    end: new Date(2026, 6, 20, 14, 0),
    description: "Review AI-generated recommendations",
    attendees: ["Sarah J.", "Alex K."],
    status: "pending"
  },
  {
    id: "8",
    title: "SMS Campaign Setup",
    type: "task",
    start: new Date(2026, 6, 8, 9, 30),
    end: new Date(2026, 6, 8, 10, 30),
    description: "Configure new SMS campaign templates",
    status: "pending"
  },
  {
    id: "9",
    title: "Marketing Strategy Session",
    type: "meeting",
    start: new Date(2026, 6, 11, 10, 0),
    end: new Date(2026, 6, 11, 12, 0),
    description: "Quarterly marketing strategy planning",
    attendees: ["Sarah J.", "Mike C.", "Emma D."],
    status: "pending"
  },
  {
    id: "10",
    title: "Social Media Campaign",
    type: "campaign",
    start: new Date(2026, 6, 16, 9, 0),
    end: new Date(2026, 6, 16, 10, 0),
    description: "Launch social media engagement campaign",
    attendees: ["Lisa W.", "Mike C."],
    status: "pending"
  }
];

const eventTypeLabels: Record<EventType, string> = {
  campaign: "Campaign",
  task: "Task",
  meeting: "Meeting",
  deadline: "Deadline"
};

// ── Main Component ──────────────────────────────────────────────────────
export function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<EventType | "all">("all");
  const [events, setEvents] = useState<CustomEvent[]>(sampleEvents);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<CustomEvent>>({});

  // Get calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const filteredEvents = useMemo(() => {
    let filtered = events;
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
  }, [events, filterType, searchQuery]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(event => event.start >= now && event.status === "pending")
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5);
  }, [events]);

  const monthStats = useMemo(() => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthEvents = events.filter(event => 
      event.start.getMonth() === currentMonth && 
      event.start.getFullYear() === currentYear
    );
    return {
      total: monthEvents.length,
      campaigns: monthEvents.filter(e => e.type === "campaign").length,
      tasks: monthEvents.filter(e => e.type === "task").length,
      meetings: monthEvents.filter(e => e.type === "meeting").length,
      completed: monthEvents.filter(e => e.status === "completed").length
    };
  }, [currentDate, events]);

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => isSameDay(event.start, day));
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleEditEvent = (event: CustomEvent) => {
    setEditForm({
      ...event,
      start: event.start,
      end: event.end
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editForm.id) return;
    
    const updatedEvents = events.map(event => 
      event.id === editForm.id 
        ? { ...event, ...editForm } as CustomEvent
        : event
    );
    setEvents(updatedEvents);
    
    if (selectedEvent?.id === editForm.id) {
      setSelectedEvent({ ...selectedEvent, ...editForm } as CustomEvent);
    }
    
    setIsEditModalOpen(false);
    alert('Event updated successfully!');
  };

  const handleCompleteEvent = (event: CustomEvent) => {
    const updatedEvents = events.map(e => 
      e.id === event.id 
        ? { ...e, status: 'completed' as const }
        : e
    );
    setEvents(updatedEvents);
    
    if (selectedEvent?.id === event.id) {
      setSelectedEvent({ ...selectedEvent, status: 'completed' });
    }
    
    alert(`Event "${event.title}" marked as completed!`);
  };

  const handleCreateEvent = () => {
    const newEvent: CustomEvent = {
      id: `new-${Date.now()}`,
      title: "New Event",
      type: "task",
      start: new Date(),
      end: new Date(Date.now() + 3600000), // 1 hour later
      description: "",
      status: "pending"
    };
    setEditForm(newEvent);
    setIsEditModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    setSelectedEvent(null);
    alert('Event deleted successfully!');
  };

  const eventColors: Record<EventType, string> = {
    campaign: "bg-blue-500",
    task: "bg-emerald-500", 
    meeting: "bg-purple-500",
    deadline: "bg-red-500"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/80 to-blue-50/30 px-3 py-3 space-y-3">
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border dark:border-slate-700">
            <div className="sticky top-0 bg-[#E8F7EE] dark:bg-[#143D2C]/80 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#143D2C] dark:text-[#E8F7EE]">
                {editForm.id?.startsWith('new-') ? 'Create New Event' : 'Edit Event'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Title</label>
                <Input
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Enter event title"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Type</label>
                <select
                  value={editForm.type || 'task'}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value as EventType })}
                  className="w-full h-9 px-3 border border-slate-300 dark:border-slate-700 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="campaign">Campaign</option>
                  <option value="task">Task</option>
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Date & Time</label>
                <Input
                  type="datetime-local"
                  value={editForm.start ? format(editForm.start, "yyyy-MM-dd'T'HH:mm") : ''}
                  onChange={(e) => setEditForm({ ...editForm, start: new Date(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">End Date & Time</label>
                <Input
                  type="datetime-local"
                  value={editForm.end ? format(editForm.end, "yyyy-MM-dd'T'HH:mm") : ''}
                  onChange={(e) => setEditForm({ ...editForm, end: new Date(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Enter event description"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm resize-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Attendees (comma-separated)</label>
                <Input
                  value={editForm.attendees?.join(', ') || ''}
                  onChange={(e) => setEditForm({ 
                    ...editForm, 
                    attendees: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                  })}
                  placeholder="Sarah J., Mike C."
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 pt-2">
                {editForm.id && !editForm.id.startsWith('new-') && (
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => {
                      handleDeleteEvent(editForm.id!);
                      setIsEditModalOpen(false);
                    }}
                  >
                    Delete Event
                  </Button>
                )}
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#00C853] hover:bg-[#00C853]/90"
                  onClick={() => {
                    if (editForm.id?.startsWith('new-')) {
                      setEvents([...events, editForm as CustomEvent]);
                      alert('Event created successfully!');
                    } else {
                      handleSaveEdit();
                    }
                    setIsEditModalOpen(false);
                  }}
                >
                  {editForm.id?.startsWith('new-') ? 'Create' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#00C853]" />
            Marketing Calendar
          </h1>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Schedule campaigns, tasks, and track deadlines</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-7 text-[10px] px-2 font-semibold"
            onClick={handleToday}
          >
            Today
          </Button>
          <Button
            className="h-7 text-[10px] px-2 gap-1 font-semibold bg-[#00C853] hover:bg-[#00C853]/90"
            onClick={handleCreateEvent}
          >
            <Plus className="h-3 w-3" />
            New Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-md transition-all bg-white dark:bg-slate-900">
          <CardContent className="p-3.5">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Total Events</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{monthStats.total}</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-md transition-all bg-white dark:bg-slate-900">
          <CardContent className="p-3.5">
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Campaigns</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{monthStats.campaigns}</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-md transition-all bg-white dark:bg-slate-900">
          <CardContent className="p-3.5">
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Tasks</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{monthStats.tasks}</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-md transition-all bg-white dark:bg-slate-900">
          <CardContent className="p-3.5">
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">Meetings</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{monthStats.meetings}</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-md transition-all bg-white dark:bg-slate-900">
          <CardContent className="p-3.5">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Completed</p>
            <p className="text-2xl font-bold text-[#00C853] dark:text-[#00C853] mt-1">{monthStats.completed}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="h-8 pl-8 text-xs"
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {["all", "campaign", "task", "meeting", "deadline"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as EventType | "all")}
                  className={cn(
                    "text-[10px] font-semibold px-3 py-1.5 rounded transition-all capitalize",
                    filterType === type ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
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
        <Card className="lg:col-span-3 border border-slate-200/60 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900">
          <CardContent className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              </button>
              
              <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              
              <button
                onClick={handleNextMonth}
                className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-slate-700 dark:text-slate-300" />
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
                      !isCurrentMonth && "bg-slate-50/50 dark:bg-slate-800/30 opacity-40",
                      isCurrentMonth && "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700",
                      isTodayDate && !isSelected && "border-[#00C853] bg-[#00C853]/5 dark:bg-[#00C853]/10",
                      isSelected && "border-[#00C853] bg-[#00C853]/10 dark:bg-[#00C853]/20 shadow-lg scale-105"
                    )}
                  >
                    <div className="flex flex-col h-full">
                      <span className={cn(
                        "text-base font-bold mb-1",
                        isTodayDate ? "text-white bg-[#00C853] rounded-full w-7 h-7 flex items-center justify-center" : "text-slate-900 dark:text-white"
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
            <Card className="border border-[#00C853]/30 dark:border-[#00C853]/50 shadow-lg bg-white dark:bg-slate-900">
              <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100 dark:border-slate-800 bg-[#00C853]/5 dark:bg-[#00C853]/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Event Details</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => setSelectedEvent(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{selectedEvent.title}</h3>
                  <Badge className={cn(
                    "text-[9px] font-semibold",
                    selectedEvent.type === "campaign" && "bg-blue-100 text-blue-700",
                    selectedEvent.type === "task" && "bg-emerald-100 text-emerald-700",
                    selectedEvent.type === "meeting" && "bg-purple-100 text-purple-700",
                    selectedEvent.type === "deadline" && "bg-red-100 text-red-700"
                  )}>
                    {eventTypeLabels[selectedEvent.type]}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                    <Clock className="h-3.5 w-3.5 text-[#00C853]" />
                    <span>{format(selectedEvent.start, "MMM dd, yyyy h:mm a")}</span>
                  </div>
                  {selectedEvent.end && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                      <Clock className="h-3.5 w-3.5 text-[#00C853]" />
                      <span>to {format(selectedEvent.end, "h:mm a")}</span>
                    </div>
                  )}
                  {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                    <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                      <Users className="h-3.5 w-3.5 mt-0.5 text-[#00C853]" />
                      <span>{selectedEvent.attendees.join(", ")}</span>
                    </div>
                  )}
                </div>
                {selectedEvent.description && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{selectedEvent.description}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1 h-8 text-xs hover:bg-slate-100"
                    onClick={() => handleEditEvent(selectedEvent)}
                  >
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  {selectedEvent.status === "pending" && (
                    <Button 
                      size="sm" 
                      className="flex-1 h-8 text-xs bg-[#00C853] hover:bg-[#00C853]/90"
                      onClick={() => handleCompleteEvent(selectedEvent)}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-500 dark:text-slate-400">No upcoming events</p>
                </div>
              ) : (
                upcomingEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-[#00C853]/20"
                  >
                    <div className={cn(
                      "h-2.5 w-2.5 rounded-full flex-shrink-0 mt-1.5",
                      eventColors[event.type]
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{event.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {format(event.start, "MMM dd")} • {format(event.start, "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border border-slate-200/60 dark:border-slate-700 shadow-sm bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Event Types</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50 dark:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-blue-500 shadow-sm" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Campaign</span>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{monthStats.campaigns}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/20">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-emerald-500 shadow-sm" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Task</span>
                </div>
                <span className="text-xs font-bold text-emerald-600">{monthStats.tasks}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50/50">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-purple-500 shadow-sm" />
                  <span className="text-xs font-semibold text-slate-700">Meeting</span>
                </div>
                <span className="text-xs font-bold text-purple-600">{monthStats.meetings}</span>
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

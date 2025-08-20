"use client";

import { useState, useEffect, useMemo } from "react";

interface EventItem {
  id: string;
  name: string;
  date: string;
  createdAt: Date;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; date?: string }>({});

  // Load events from localStorage on mount
  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem("events-app-data");
      if (savedEvents) {
        const parsed = JSON.parse(savedEvents);
        setEvents(parsed.map((event: any) => ({
          ...event,
          createdAt: new Date(event.createdAt),
        })));
      }
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    try {
      localStorage.setItem("events-app-data", JSON.stringify(events));
    } catch (error) {
      console.error("Failed to save events:", error);
    }
  }, [events]);

  // Form validation
  const validateForm = () => {
    const newErrors: { name?: string; date?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = "Event name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Event name must be at least 2 characters";
    } else if (name.trim().length > 100) {
      newErrors.name = "Event name must be less than 100 characters";
    }
    
    if (!date) {
      newErrors.date = "Date is required";
    } else if (new Date(date) < new Date(new Date().toDateString())) {
      newErrors.date = "Date cannot be in the past";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add event with validation and loading state
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newEvent: EventItem = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      date,
      createdAt: new Date(),
    };
    
    setEvents(prev => [newEvent, ...prev]);
    setName("");
    setDate("");
    setErrors({});
    setIsLoading(false);
  };

  // Delete event with confirmation
  const handleDelete = (id: string, eventName: string) => {
    if (window.confirm(`Are you sure you want to delete "${eventName}"?`)) {
      setEvents(prev => prev.filter(event => event.id !== id));
    }
  };

  // Clear all events
  const handleClearAll = () => {
    if (events.length > 0 && window.confirm(`Delete all ${events.length} events? This cannot be undone.`)) {
      setEvents([]);
      setSearchQuery("");
    }
  };

  // Export events as JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `events-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered and sorted events
  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    if (searchQuery.trim()) {
      filtered = events.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.date.includes(searchQuery)
      );
    }
    
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, searchQuery]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  // Get days until event
  const getDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              Event Manager
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Assignment submission at <span className="font-semibold">PyCray Tech</span>
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Sidebar - Form */}
          <div className="lg:col-span-2">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-gradient-to-r from-gray-600 to-gray-800 p-2 rounded-lg mr-3">
                  +
                </span>
                Add New Event
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter event name..."
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    className={`w-full p-3 bg-gray-800/90 backdrop-blur border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent ${
                      errors.name ? 'border-red-400 bg-red-900/30' : 'border-gray-600/50 focus:bg-gray-800'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-red-300 text-sm mt-1 flex items-center">
                      <span className="mr-1">!</span>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Date Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if (errors.date) setErrors(prev => ({ ...prev, date: undefined }));
                    }}
                    className={`w-full p-3 bg-gray-800/90 backdrop-blur border-2 rounded-xl text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent ${
                      errors.date ? 'border-red-400 bg-red-900/30' : 'border-gray-600/50 focus:bg-gray-800'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.date && (
                    <p className="text-red-300 text-sm mt-1 flex items-center">
                      <span className="mr-1">!</span>
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding Event...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">+</span>
                      Add Event
                    </span>
                  )}
                </button>
              </form>

              {/* Quick Stats */}
              {events.length > 0 && (
                <div className="mt-6 p-4 bg-black/20 rounded-xl">
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold">{events.length}</div>
                    <div className="text-sm text-slate-300">
                      {events.length === 1 ? 'Event Planned' : 'Events Planned'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Events List */}
          <div className="lg:col-span-3">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-700/50">
              {/* Search and Actions Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <span className="bg-gradient-to-r from-gray-600 to-gray-900 p-2 rounded-lg mr-3">
                    ◊
                  </span>
                  Your Events
                  {filteredEvents.length !== events.length && (
                    <span className="ml-2 text-sm bg-gray-600/30 text-gray-300 px-2 py-1 rounded-full">
                      {filteredEvents.length} of {events.length}
                    </span>
                  )}
                </h2>

                {events.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleExport}
                      className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600/50 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      Export
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="px-4 py-2 bg-red-900/30 hover:bg-red-800/40 text-red-300 border border-red-700/50 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {/* Search Box */}
              {events.length > 0 && (
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">⌕</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search events by name or date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/90 backdrop-blur border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}

              {/* Events List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12">
                    {events.length === 0 ? (
                      <div className="text-slate-300">
                        <div className="text-6xl mb-4">□</div>
                        <h3 className="text-xl font-semibold mb-2">No events yet</h3>
                        <p className="text-slate-400">Create your first event to get started</p>
                      </div>
                    ) : (
                      <div className="text-slate-300">
                        <div className="text-4xl mb-4">⌕</div>
                        <h3 className="text-lg font-semibold mb-2">No events found</h3>
                        <p className="text-slate-400">
                          No events match "{searchQuery}"
                        </p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="mt-3 text-gray-400 hover:text-gray-200 underline"
                        >
                          Clear search
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  filteredEvents.map((event) => {
                    const daysUntil = getDaysUntil(event.date);
                    const isUpcoming = daysUntil >= 0;
                    const isPast = daysUntil < 0;
                    const isToday = daysUntil === 0;
                    const isTomorrow = daysUntil === 1;

                    return (
                      <div
                        key={event.id}
                        className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                          isToday
                            ? 'bg-gradient-to-r from-gray-700/40 to-gray-800/40 border-gray-500/60'
                            : isTomorrow
                            ? 'bg-gradient-to-r from-gray-600/40 to-gray-700/40 border-gray-500/50'
                            : isPast
                            ? 'bg-gradient-to-r from-gray-800/40 to-black/40 border-gray-700/50'
                            : 'bg-gradient-to-r from-gray-700/30 to-gray-800/30 border-gray-600/40'
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-white mb-1 truncate">
                                {event.name}
                              </h3>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                                <span className="text-slate-300 flex items-center">
                                  <span className="mr-1">○</span>
                                  {formatDate(event.date)}
                                </span>
                                <div className="flex items-center gap-2">
                                  {isToday && (
                                    <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full font-medium">
                                      Today
                                    </span>
                                  )}
                                  {isTomorrow && (
                                    <span className="px-2 py-1 bg-gray-700 text-white text-xs rounded-full font-medium">
                                      Tomorrow
                                    </span>
                                  )}
                                  {!isToday && !isTomorrow && (
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                      isPast
                                        ? 'bg-gray-800/50 text-gray-400'
                                        : isUpcoming && daysUntil <= 7
                                        ? 'bg-gray-600/40 text-gray-300'
                                        : 'bg-gray-700/40 text-gray-300'
                                    }`}>
                                      {isPast
                                        ? `${Math.abs(daysUntil)} days ago`
                                        : `${daysUntil} days away`}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDelete(event.id, event.name)}
                              className="ml-4 p-2 text-red-300 hover:text-red-100 hover:bg-red-900/30 rounded-lg transition-all duration-200 opacity-70 hover:opacity-100"
                              title={`Delete ${event.name}`}
                            >
                              <span className="text-lg">×</span>
                            </button>
                          </div>
                        </div>

                        {/* Subtle animated background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Stats */}
              {events.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <div className="flex justify-between items-center text-sm text-gray-300">
                    <span>
                      {events.length} total event{events.length !== 1 ? 's' : ''}
                    </span>
                    <span>
                      {events.filter(e => getDaysUntil(e.date) >= 0).length} upcoming
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
  );
}

// Helper function outside component
function getDaysUntil(dateString: string): number {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  const diffTime = eventDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
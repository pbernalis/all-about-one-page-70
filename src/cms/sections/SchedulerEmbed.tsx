import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EventItem {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO timestamp
  end: string;   // ISO timestamp
  duration_minutes?: number;
  available: boolean;
}

interface SchedulerEmbedProps {
  data: {
    calendar_id?: string;
    title?: string;
    subtitle?: string;
    max_days?: number;
  };
}

export function SchedulerEmbed({ data }: SchedulerEmbedProps) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', note: '' });
  const { toast } = useToast();

  const title = data.title || 'Book an Appointment';
  const subtitle = data.subtitle || 'Choose an available time slot';
  const maxDays = data.max_days || 14;

  // Get timezone for display
  const timezone = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);

  // Fetch available events
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + maxDays);

        let query = supabase
          .from('events')
          .select('id, title, description, start, end, duration_minutes, available')
          .eq('available', true)
          .gte('end', new Date().toISOString())
          .lte('start', endDate.toISOString())
          .order('start');

        if (data.calendar_id) {
          query = query.eq('calendar_id', data.calendar_id);
        }

        const { data: eventsData, error } = await query;

        if (error) {
          console.error('Error fetching events:', error);
          toast({
            title: 'Error',
            description: 'Failed to load available appointments',
            variant: 'destructive'
          });
          return;
        }

        setEvents(eventsData || []);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'Failed to load appointments',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [data.calendar_id, maxDays, toast]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const groups: Record<string, EventItem[]> = {};
    
    events.forEach(event => {
      const date = new Date(event.start).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });

    return groups;
  }, [events]);

  // Handle booking
  const handleBooking = async () => {
    if (!selectedEvent || !form.email) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          event_id: selectedEvent.id,
          email: form.email,
          name: form.name || null,
          note: form.note || null,
        });

      if (error) {
        console.error('Booking error:', error);
        toast({
          title: 'Error',
          description: 'Failed to create booking. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success!',
        description: 'Your appointment has been booked successfully.',
      });

      // Remove booked event from list and close modal
      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
      setShowBookingModal(false);
      setForm({ email: '', name: '', note: '' });
      setSelectedEvent(null);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openBookingModal = (event: EventItem) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          </div>
          <div className="grid gap-4 max-w-2xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Calendar className="h-8 w-8" />
            {title}
          </h2>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Times shown in {timezone}
          </p>
        </div>

        {Object.keys(eventsByDate).length === 0 ? (
          <Card className="max-w-md mx-auto p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No appointments available</h3>
            <p className="text-muted-foreground text-sm">
              Please check back later for new time slots.
            </p>
          </Card>
        ) : (
          <div className="space-y-8 max-w-2xl mx-auto">
            {Object.entries(eventsByDate).map(([date, dateEvents]) => (
              <div key={date}>
                <h3 className="font-semibold text-lg mb-4">
                  {formatDate(dateEvents[0].start)}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {dateEvents.map(event => (
                    <Card
                      key={event.id}
                      className="p-4 hover:shadow-md transition-all cursor-pointer border-2 hover:border-primary"
                      onClick={() => openBookingModal(event)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {formatTime(event.start)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.title}
                      </p>
                      {event.duration_minutes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.duration_minutes} minutes
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Book Appointment
              </DialogTitle>
            </DialogHeader>

            {selectedEvent && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">
                      {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedEvent.start)}
                  </p>
                  <p className="text-sm mt-1">{selectedEvent.title}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="note" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Additional Notes
                    </Label>
                    <Textarea
                      id="note"
                      value={form.note}
                      onChange={(e) => setForm(prev => ({ ...prev, note: e.target.value }))}
                      placeholder="Any special requests or notes..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBooking}
                    disabled={submitting || !form.email}
                    className="flex-1"
                  >
                    {submitting ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
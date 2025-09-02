import React, { useState, useEffect, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { Plus, Edit, Trash2, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BookingsViewer from './BookingsViewer';

interface Event {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  duration_minutes?: number;
  max_bookings: number;
  current_bookings: number;
  available: boolean;
  created_at: string;
}

interface EventForm {
  title: string;
  description: string;
  start: string;
  end: string;
  max_bookings: number;
}

export function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBookingsViewer, setShowBookingsViewer] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    start: '',
    end: '',
    max_bookings: 1,
  });
  const { toast } = useToast();

  const columnHelper = createColumnHelper<Event>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Title',
        cell: (info) => (
          <div className="font-medium">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor('start', {
        header: 'Start Time',
        cell: (info) => (
          <div className="text-sm">
            {new Date(info.getValue()).toLocaleString()}
          </div>
        ),
      }),
      columnHelper.accessor('end', {
        header: 'End Time',
        cell: (info) => (
          <div className="text-sm">
            {new Date(info.getValue()).toLocaleString()}
          </div>
        ),
      }),
      columnHelper.accessor('max_bookings', {
        header: 'Capacity',
        cell: (info) => (
          <div className="text-center">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              {info.row.original.current_bookings}/{info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('available', {
        header: 'Status',
        cell: (info) => (
          <div className="text-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              info.getValue() 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {info.getValue() ? 'Available' : 'Full'}
            </span>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewBookings(info.row.original)}
              title="View Bookings"
            >
              <Users className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(info.row.original)}
              title="Edit Event"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(info.row.original)}
              title="Delete Event"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start', { ascending: true });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch events',
          variant: 'destructive',
        });
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setForm({
      title: '',
      description: '',
      start: '',
      end: '',
      max_bookings: 1,
    });
    setShowCreateModal(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setForm({
      title: event.title,
      description: event.description || '',
      start: new Date(event.start).toISOString().slice(0, 16),
      end: new Date(event.end).toISOString().slice(0, 16),
      max_bookings: event.max_bookings,
    });
    setShowEditModal(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleViewBookings = (event: Event) => {
    setSelectedEvent(event);
    setShowBookingsViewer(true);
  };

  const submitCreate = async () => {
    if (!form.title || !form.start || !form.end) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('events')
        .insert({
          title: form.title,
          description: form.description || null,
          start: new Date(form.start).toISOString(),
          end: new Date(form.end).toISOString(),
          max_bookings: form.max_bookings,
          current_bookings: 0,
          available: true,
        });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to create event',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Event created successfully',
      });

      setShowCreateModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async () => {
    if (!selectedEvent || !form.title || !form.start || !form.end) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: form.title,
          description: form.description || null,
          start: new Date(form.start).toISOString(),
          end: new Date(form.end).toISOString(),
          max_bookings: form.max_bookings,
        })
        .eq('id', selectedEvent.id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update event',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Event updated successfully',
      });

      setShowEditModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update event',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', selectedEvent.id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete event',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });

      setShowDeleteModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Events Admin</h1>
          </div>
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Events Admin</h1>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left p-4 font-medium cursor-pointer hover:bg-muted/50"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first event to get started
            </p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <EventForm form={form} setForm={setForm} />
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={submitCreate}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <EventForm form={form} setForm={setForm} />
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={submitEdit}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this event?</p>
            <p className="font-semibold mt-2">{selectedEvent?.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Deleting...' : 'Delete Event'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bookings Viewer */}
      <BookingsViewer
        event={selectedEvent}
        isOpen={showBookingsViewer}
        onClose={() => setShowBookingsViewer(false)}
      />
    </div>
  );
}

function EventForm({ form, setForm }: { 
  form: EventForm; 
  setForm: (updater: (prev: EventForm) => EventForm) => void; 
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Event title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Event description (optional)"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start">Start Time *</Label>
          <Input
            id="start"
            type="datetime-local"
            value={form.start}
            onChange={(e) => setForm(prev => ({ ...prev, start: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="end">End Time *</Label>
          <Input
            id="end"
            type="datetime-local"
            value={form.end}
            onChange={(e) => setForm(prev => ({ ...prev, end: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="capacity">Max Bookings *</Label>
        <Input
          id="capacity"
          type="number"
          min={1}
          value={form.max_bookings}
          onChange={(e) => setForm(prev => ({ ...prev, max_bookings: parseInt(e.target.value) || 1 }))}
          required
        />
      </div>
    </div>
  );
}
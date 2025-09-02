import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Users, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Booking {
  id: string;
  email: string;
  name: string | null;
  note: string | null;
  status: string;
  created_at: string;
  booked_at: string;
  event_id: string;
}

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  max_bookings: number;
  current_bookings: number;
  available: boolean;
}

interface BookingsViewerProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingsViewer: React.FC<BookingsViewerProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (event && isOpen) {
      fetchBookings();
    }
  }, [event, isOpen]);

  const fetchBookings = async () => {
    if (!event) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('event_id', event.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch bookings',
          variant: 'destructive',
        });
        return;
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (booking.name && booking.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportToCSV = () => {
    if (!event || filteredBookings.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no bookings to export',
        variant: 'destructive',
      });
      return;
    }

    const headers = ['Email', 'Name', 'Status', 'Note', 'Booked At', 'Created At'];
    const csvData = [
      headers.join(','),
      ...filteredBookings.map(booking => [
        `"${booking.email}"`,
        `"${booking.name || ''}"`,
        `"${booking.status}"`,
        `"${(booking.note || '').replace(/"/g, '""')}"`,
        `"${new Date(booking.booked_at).toLocaleString()}"`,
        `"${new Date(booking.created_at).toLocaleString()}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings-${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export successful',
      description: `Exported ${filteredBookings.length} bookings to CSV`,
    });
  };

  const remainingSeats = event ? event.max_bookings - event.current_bookings : 0;

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bookings for "{event.title}"
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {/* Event Info Card */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(event.start).toLocaleString()} — {new Date(event.end).toLocaleString()}
              </div>
              <div className="ml-auto flex items-center gap-4">
                <Badge variant={event.available ? 'default' : 'destructive'}>
                  {event.available ? 'Available' : 'Full'}
                </Badge>
                <div className="text-sm">
                  Capacity: <span className="font-medium">{event.max_bookings}</span>
                </div>
                <div className="text-sm">
                  Remaining: <span className={`font-medium ${remainingSeats === 0 ? 'text-destructive' : 'text-foreground'}`}>
                    {remainingSeats}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Search and Export */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredBookings.length} / {bookings.length}
            </div>
            <Button
              onClick={exportToCSV}
              disabled={filteredBookings.length === 0}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Bookings Table */}
          {loading ? (
            <Card className="p-4">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Email</th>
                      <th className="px-4 py-3 text-left font-medium">Name</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Note</th>
                      <th className="px-4 py-3 text-left font-medium">Booked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-t hover:bg-muted/25">
                        <td className="px-4 py-3">{booking.email}</td>
                        <td className="px-4 py-3">{booking.name || '—'}</td>
                        <td className="px-4 py-3">
                          <Badge 
                            variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <div className="truncate" title={booking.note || ''}>
                            {booking.note || '—'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(booking.booked_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {filteredBookings.length === 0 && (
                      <tr>
                        <td className="px-4 py-8 text-center text-muted-foreground" colSpan={5}>
                          {searchQuery ? 'No bookings match your search' : 'No bookings yet'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingsViewer;
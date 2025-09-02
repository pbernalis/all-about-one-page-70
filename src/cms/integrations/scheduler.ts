// Client utilities for interacting with the scheduler system
import { supabase } from '@/integrations/supabase/client';

export interface Slot {
  id: string;
  start: string;
  end: string;
  available: boolean;
  title?: string;
  description?: string;
}

export interface BookingData {
  email: string;
  name?: string;
  note?: string;
}

/**
 * Fetch available appointment slots for a date range
 */
export async function fetchAvailableSlots(
  calendarId?: string,
  fromDate?: Date,
  toDate?: Date
): Promise<Slot[]> {
  const from = fromDate || new Date();
  const to = toDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days ahead

  let query = supabase
    .from('events')
    .select('id, title, description, start, end, available')
    .eq('available', true)
    .gte('end', from.toISOString())
    .lte('start', to.toISOString())
    .order('start');

  if (calendarId) {
    query = query.eq('calendar_id', calendarId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch slots: ${error.message}`);
  }

  return (data || []).map(event => ({
    id: event.id,
    start: event.start,
    end: event.end,
    available: event.available,
    title: event.title,
    description: event.description,
  }));
}

/**
 * Book an appointment slot
 */
export async function bookAppointment(
  eventId: string,
  bookingData: BookingData
): Promise<{ success: boolean; bookingId?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        event_id: eventId,
        email: bookingData.email,
        name: bookingData.name || null,
        note: bookingData.note || null,
      })
      .select('id')
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      bookingId: data.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get user's bookings
 */
export async function getUserBookings(email: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      booked_at,
      name,
      note,
      events (
        id,
        title,
        start,
        end,
        description
      )
    `)
    .eq('email', email)
    .order('booked_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }

  return data || [];
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: string): Promise<boolean> {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);

  if (error) {
    throw new Error(`Failed to cancel booking: ${error.message}`);
  }

  return true;
}

/**
 * Get calendar information
 */
export async function getCalendar(calendarId: string) {
  const { data, error } = await supabase
    .from('calendars')
    .select('*')
    .eq('id', calendarId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch calendar: ${error.message}`);
  }

  return data;
}

/**
 * List all available calendars
 */
export async function listCalendars() {
  const { data, error } = await supabase
    .from('calendars')
    .select('id, name, description, timezone')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch calendars: ${error.message}`);
  }

  return data || [];
}
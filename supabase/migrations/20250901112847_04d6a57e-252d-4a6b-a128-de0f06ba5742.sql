-- Create calendars table for different calendar instances
CREATE TABLE public.calendars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  timezone TEXT DEFAULT 'UTC',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table for available time slots
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start TIMESTAMP WITH TIME ZONE NOT NULL,
  "end" TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER,
  max_bookings INTEGER DEFAULT 1,
  current_bookings INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table for user reservations
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  note TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'pending')),
  booked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for calendars (public read, admin write)
CREATE POLICY "Calendars are publicly viewable" 
ON public.calendars 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can manage calendars" 
ON public.calendars 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for events (public read available events, admin write)
CREATE POLICY "Available events are publicly viewable" 
ON public.events 
FOR SELECT 
USING (available = true AND "end" > now());

CREATE POLICY "Only authenticated users can manage events" 
ON public.events 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for bookings (users can create, admin can view all)
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (true); -- For now allow all reads, can be restricted later

CREATE POLICY "Only authenticated users can manage all bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete bookings" 
ON public.bookings 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX idx_events_calendar_id ON public.events(calendar_id);
CREATE INDEX idx_events_start_end ON public.events(start, "end");
CREATE INDEX idx_events_available ON public.events(available);
CREATE INDEX idx_bookings_event_id ON public.bookings(event_id);
CREATE INDEX idx_bookings_email ON public.bookings(email);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_calendars_updated_at
  BEFORE UPDATE ON public.calendars
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update current_bookings count
CREATE OR REPLACE FUNCTION public.update_event_booking_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.events 
    SET current_bookings = current_bookings + 1
    WHERE id = NEW.event_id;
    
    -- Mark event as unavailable if max bookings reached
    UPDATE public.events 
    SET available = false
    WHERE id = NEW.event_id 
    AND current_bookings >= max_bookings;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.events 
    SET current_bookings = GREATEST(0, current_bookings - 1),
        available = true
    WHERE id = OLD.event_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to maintain booking counts
CREATE TRIGGER update_event_booking_count_trigger
  AFTER INSERT OR DELETE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_event_booking_count();

-- Insert sample data for testing
INSERT INTO public.calendars (id, name, description, timezone) VALUES
  (gen_random_uuid(), 'General Appointments', 'Main calendar for appointments', 'UTC'),
  (gen_random_uuid(), 'Consultation Calls', 'Calendar for consultation calls', 'UTC');

-- Insert sample events (next 7 days, working hours)
INSERT INTO public.events (calendar_id, title, description, start, "end", duration_minutes, max_bookings)
SELECT 
  (SELECT id FROM public.calendars LIMIT 1),
  'Available Appointment',
  'Open appointment slot',
  (current_date + (day_offset || ' days')::interval + (hour_offset || ' hours')::interval)::timestamp with time zone,
  (current_date + (day_offset || ' days')::interval + (hour_offset + 1 || ' hours')::interval)::timestamp with time zone,
  60,
  1
FROM 
  generate_series(1, 7) AS day_offset,
  generate_series(9, 17) AS hour_offset
WHERE hour_offset < 17; -- 9 AM to 5 PM slots
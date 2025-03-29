-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.donations;
DROP TABLE IF EXISTS public.charities;

-- Create the charities table
CREATE TABLE IF NOT EXISTS public.charities (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create the donations table (note: lowercase name)
CREATE TABLE IF NOT EXISTS public.donations (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    charity_id UUID REFERENCES public.charities(id) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    eth_amount DECIMAL(18,8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON public.donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_charity_id ON public.donations(charity_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users" ON public.donations
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users" ON public.donations
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable read access for all users" ON public.charities
    FOR SELECT TO authenticated
    USING (true);

-- Insert some sample charities
INSERT INTO public.charities (name, description) VALUES
    ('Red Cross', 'International humanitarian organization'),
    ('UNICEF', 'United Nations Children''s Fund'),
    ('WWF', 'World Wildlife Fund')
ON CONFLICT (name) DO NOTHING; 
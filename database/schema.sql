-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the charities table
CREATE TABLE IF NOT EXISTS public.charities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the donations table
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    charity_id UUID REFERENCES public.charities(id),
    amount DECIMAL(10,2) NOT NULL,
    eth_amount DECIMAL(18,8),
    transaction_hash TEXT,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the transactions table for detailed transaction tracking
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donation_id UUID REFERENCES public.donations(id),
    transaction_hash TEXT,
    from_address TEXT,
    to_address TEXT,
    amount DECIMAL(18,8),
    gas_price DECIMAL(18,8),
    gas_used DECIMAL(18,8),
    status TEXT CHECK (status IN ('pending', 'confirmed', 'failed')) DEFAULT 'pending',
    block_number BIGINT,
    block_timestamp TIMESTAMPTZ,
    network_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON public.donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_charity_id ON public.donations(charity_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_transactions_donation_id ON public.transactions(donation_id);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON public.transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Enable read access for transaction owner" ON public.transactions
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.donations
        WHERE donations.id = transactions.donation_id
        AND donations.user_id = auth.uid()
    ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_charities_updated_at
    BEFORE UPDATE ON public.charities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
    BEFORE UPDATE ON public.donations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample charities
INSERT INTO public.charities (name, description) VALUES
    ('Red Cross', 'International humanitarian organization'),
    ('UNICEF', 'United Nations Children''s Fund'),
    ('WWF', 'World Wildlife Fund')
ON CONFLICT (name) DO NOTHING; 
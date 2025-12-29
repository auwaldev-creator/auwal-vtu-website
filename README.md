# VTU Website

A complete VTU (Virtual Top-Up) website with authentication, dashboard, and services.

## Features
- User authentication (Signup/Login with Supabase)
- Dashboard with balance display
- Buy Data (MTN, Glo, Airtel, 9mobile)
- Buy Airtime
- Electricity Bill Payment
- NIN/BVN Printout
- Exam PIN generation
- Internal Transfer
- User Profile Management

## Live Demo
[https://auwal-vtu-website.vercel.app](https://auwal-vtu-website.vercel.app)

## Setup Instructions

### 1. Supabase Setup
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run SQL from Setup section
4. Copy URL and anon key to `supabase-config.js`

### 2. Database Setup
Run this SQL in Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  balance DECIMAL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Trigger for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

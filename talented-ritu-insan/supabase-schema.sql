-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Employees/Users table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'calls')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_hi TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_hi TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  duration TEXT,
  image_url TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshops table
CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_hi TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_hi TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  date DATE,
  time TEXT,
  seats INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  state TEXT NOT NULL,
  city TEXT,
  course_interest TEXT,
  source TEXT DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'follow_up', 'converted', 'lost')),
  assigned_to UUID REFERENCES employees(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_name TEXT NOT NULL,
  referrer_phone TEXT NOT NULL,
  referee_name TEXT NOT NULL,
  referee_phone TEXT NOT NULL,
  course_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rewarded')),
  reward_amount DECIMAL(10,2) DEFAULT 500,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Superstars (Testimonials/Success Stories) table
CREATE TABLE IF NOT EXISTS superstars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT,
  course TEXT,
  achievement TEXT,
  testimonial TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Centres table
CREATE TABLE IF NOT EXISTS centres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Landing Pages table
CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhooks table (for tracking webhook events)
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL,
  event_type TEXT,
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE superstars ENABLE ROW LEVEL SECURITY;
ALTER TABLE centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to courses, workshops, superstars
CREATE POLICY "Public read access" ON courses FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON workshops FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON superstars FOR SELECT USING (true);
CREATE POLICY "Public read access" ON centres FOR SELECT USING (is_active = true);

-- Create policies for authenticated users (admin, manager, calls)
CREATE POLICY "Admin full access" ON employees FOR ALL USING (
  EXISTS (
    SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Staff read access" ON employees FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM employees WHERE id = auth.uid()
  )
);

CREATE POLICY "Admin manage courses" ON courses FOR ALL USING (
  EXISTS (
    SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admin manage workshops" ON workshops FOR ALL USING (
  EXISTS (
    SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Staff manage leads" ON leads FOR ALL USING (
  EXISTS (
    SELECT 1 FROM employees WHERE id = auth.uid()
  )
);

CREATE POLICY "Admin manage referrals" ON referrals FOR ALL USING (
  EXISTS (
    SELECT 1 FROM employees WHERE id = auth.uid()
  )
);

CREATE POLICY "Admin manage centres" ON centres FOR ALL USING (
  EXISTS (
    SELECT 1 FROM employees WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user (you'll need to create this user in Supabase Auth first)
-- INSERT INTO employees (id, name, email, role) VALUES 
--   (auth.uid(), 'Admin User', 'admin@example.com', 'admin');

-- Insert sample courses
INSERT INTO courses (title, title_hi, slug, description, description_hi, price, duration, image_url, category) VALUES
  ('Fashion Design Fundamentals', 'फैशन डिजाइन की मूल बातें', 'fashion-design-fundamentals', 'Learn the basics of fashion design including color theory, fabric selection, and basic sketching techniques.', 'रंग सिद्धांत, कपड़े के चयन और बुनियादी स्केचिंग तकनीकों सहित फैशन डिजाइन की मूल बातें सीखें।', 15000, '3 Months', 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400', 'Beginner'),
  ('Advanced Tailoring Course', 'एडवांस टेलरिंग कोर्स', 'advanced-tailoring', 'Master advanced tailoring techniques including pattern making, fitting, and garment construction.', 'पैटर्न मेकिंग, फिटिंग और गारमेंट कंस्ट्रक्शन सहित उन्नत टेलरिंग तकनीकों में महारत हासिल करें।', 25000, '6 Months', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'Advanced'),
  ('Boutique Management', 'बुटीक मैनेजमेंट', 'boutique-management', 'Learn how to start and manage your own boutique, including inventory management and marketing.', 'इन्वेंटरी मैनेजमेंट और मार्केटिंग सहित अपना बुटीक शुरू करने और प्रबंधित करने का तरीका सीखें।', 20000, '4 Months', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400', 'Business'),
  ('Embroidery & Designing', 'एम्ब्रॉयडरी और डिजाइनिंग', 'embroidery-designing', 'Explore various embroidery techniques and design patterns for traditional and modern garments.', 'पारंपरिक और आधुनिक कपड़ों के लिए विभिन्न कढ़ाई तकनीकों और डिजाइन पैटर्न का अन्वेषण करें।', 10000, '2 Months', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', 'Specialization');

-- Insert sample superstars
INSERT INTO superstars (name, image_url, course, achievement, testimonial) VALUES
  ('Priya Sharma', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 'Fashion Design Fundamentals', 'Started own boutique in Delhi', 'This course changed my life! I learned everything from scratch and now I run my own successful boutique.'),
  ('Anita Verma', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'Advanced Tailoring Course', 'Working with top fashion designers', 'The advanced techniques I learned here helped me land a job with a renowned designer.'),
  ('Neha Gupta', 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400', 'Boutique Management', 'Owns a successful online store', 'The business skills I gained helped me launch and grow my online fashion store.'),
  ('Pooja Singh', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Embroidery & Designing', 'Award-winning embroidery artist', 'I discovered my passion for embroidery here and have won multiple awards since.');

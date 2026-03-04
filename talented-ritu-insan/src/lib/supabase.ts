import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'calls';
  name: string;
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  title_hi: string;
  slug: string;
  description: string;
  description_hi: string;
  price: number;
  duration: string;
  image_url: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Workshop = {
  id: string;
  title: string;
  title_hi: string;
  slug: string;
  description: string;
  description_hi: string;
  price: number;
  date: string;
  time: string;
  seats: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  state: string;
  city?: string;
  course_interest?: string;
  source: string;
  status: 'new' | 'contacted' | 'follow_up' | 'converted' | 'lost';
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'calls';
  is_active: boolean;
  created_at: string;
};

export type Referral = {
  id: string;
  referrer_name: string;
  referrer_phone: string;
  referee_name: string;
  referee_phone: string;
  course_name?: string;
  status: 'pending' | 'verified' | 'rewarded';
  reward_amount: number;
  created_at: string;
};

export type Superstar = {
  id: string;
  name: string;
  image_url: string;
  course: string;
  achievement: string;
  testimonial?: string;
  created_at: string;
};

export type Centre = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  is_active: boolean;
  created_at: string;
};

export type LandingPage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
};

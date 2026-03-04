import { useEffect, useState } from 'react';
import { ArrowLeft, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { supabase, type Superstar } from '../lib/supabase';

const defaultSuperstars = [
  {
    id: '1',
    name: 'Priya Sharma',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    course: 'Fashion Design Fundamentals',
    achievement: 'Started own boutique in Delhi',
    testimonial: 'This course changed my life! I learned everything from scratch and now I run my own successful boutique.',
  },
  {
    id: '2',
    name: 'Anita Verma',
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    course: 'Advanced Tailoring Course',
    achievement: 'Working with top fashion designers',
    testimonial: 'The advanced techniques I learned here helped me land a job with a renowned designer.',
  },
  {
    id: '3',
    name: 'Neha Gupta',
    image_url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400',
    course: 'Boutique Management',
    achievement: 'Owns a successful online store',
    testimonial: 'The business skills I gained helped me launch and grow my online fashion store.',
  },
  {
    id: '4',
    name: 'Pooja Singh',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    course: 'Embroidery & Designing',
    achievement: 'Award-winning embroidery artist',
    testimonial: 'I discovered my passion for embroidery here and have won multiple awards since.',
  },
];

export function SuperstarsPage() {
  const { language } = useApp();
  const [superstars, setSuperstars] = useState<Superstar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuperstars();
  }, []);

  async function fetchSuperstars() {
    try {
      const { data, error } = await supabase
        .from('superstars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setSuperstars(data as Superstar[]);
      } else {
        setSuperstars(defaultSuperstars as unknown as Superstar[]);
      }
    } catch (error) {
      console.error('Error fetching superstars:', error);
      setSuperstars(defaultSuperstars as unknown as Superstar[]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full px-4 py-2 mb-6">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-400 text-sm font-medium">
              {language === 'en' ? '⭐ OUR SUPERSTARS' : '⭐ हमारे सुपरस्टार'}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {language === 'en' ? 'Our Superstars' : 'हमारे सुपरस्टार'}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {language === 'en'
              ? 'Meet our successful students who have transformed their passion into profession'
              : 'हमारे सफल छात्रों से मिलें जिन्होंने अपने जुनून को पेशे में बदल दिया'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {superstars.map((superstar) => (
            <div
              key={superstar.id}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={superstar.image_url}
                  alt={superstar.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg">{superstar.name}</h3>
                  <p className="text-red-400 text-sm">{superstar.course}</p>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-400 text-sm font-medium">{superstar.achievement}</span>
                </div>

                {superstar.testimonial && (
                  <p className="text-gray-400 text-sm italic">"{superstar.testimonial}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

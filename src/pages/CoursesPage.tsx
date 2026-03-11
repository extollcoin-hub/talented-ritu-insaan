import { Clock, IndianRupee, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const allCourses = [
  {
    id: 1,
    slug: 'fashion-design-fundamentals',
    title: 'Fashion Design Fundamentals',
    titleHi: 'फैशन डिजाइन की मूल बातें',
    duration: '3 Months',
    price: '₹15,000',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600',
    category: 'Beginner',
    description: 'Learn the basics of fashion design including color theory, fabric selection, and basic sketching techniques.',
  },
  {
    id: 2,
    slug: 'advanced-tailoring',
    title: 'Advanced Tailoring Course',
    titleHi: 'एडवांस टेलरिंग कोर्स',
    duration: '6 Months',
    price: '₹25,000',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    category: 'Advanced',
    description: 'Master advanced tailoring techniques including pattern making, fitting, and garment construction.',
  },
  {
    id: 3,
    slug: 'boutique-management',
    title: 'Boutique Management',
    titleHi: 'बुटीक मैनेजमेंट',
    duration: '4 Months',
    price: '₹20,000',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600',
    category: 'Business',
    description: 'Learn how to start and manage your own boutique, including inventory management and marketing.',
  },
  {
    id: 4,
    slug: 'embroidery-designing',
    title: 'Embroidery & Designing',
    titleHi: 'एम्ब्रॉयडरी और डिजाइनिंग',
    duration: '2 Months',
    price: '₹10,000',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600',
    category: 'Specialization',
    description: 'Explore various embroidery techniques and design patterns for traditional and modern garments.',
  },
  {
    id: 5,
    slug: 'stitching-basics',
    title: 'Stitching Basics',
    titleHi: 'स्टिचिंग की मूल बातें',
    duration: '2 Months',
    price: '₹8,000',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600',
    category: 'Beginner',
    description: 'Learn basic stitching techniques for different types of fabrics and garments.',
  },
  {
    id: 6,
    slug: 'fashion-illustration',
    title: 'Fashion Illustration',
    titleHi: 'फैशन इलस्ट्रेशन',
    duration: '3 Months',
    price: '₹12,000',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
    category: 'Design',
    description: 'Develop your illustration skills to create stunning fashion sketches and designs.',
  },
];

export function CoursesPage() {
  const { t, language } = useApp();

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.courses.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t.courses.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allCourses.map((course) => (
            <div
              key={course.id}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-red-600 transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                  {course.category}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {language === 'en' ? course.title : course.titleHi}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1 text-red-500 font-semibold">
                    <IndianRupee size={16} />
                    {course.price}
                  </span>
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-medium">
                  {t.courses.enroll}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

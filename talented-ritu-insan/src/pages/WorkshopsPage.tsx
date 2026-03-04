import { ArrowLeft, Calendar, Clock, Users, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const workshops = [
  {
    id: 1,
    title: 'Summer Collection Design Workshop',
    titleHi: 'समर कलेक्शन डिजाइन वर्कशॉप',
    date: 'March 15, 2024',
    time: '10:00 AM - 4:00 PM',
    price: '₹2,999',
    seats: 20,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    description: 'Learn to design stunning summer collections with expert guidance.',
  },
  {
    id: 2,
    title: 'Bridal Wear Masterclass',
    titleHi: 'ब्राइडल वेयर मास्टरक्लास',
    date: 'March 22, 2024',
    time: '11:00 AM - 5:00 PM',
    price: '₹4,999',
    seats: 15,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
    description: 'Master the art of creating beautiful bridal wear designs.',
  },
  {
    id: 3,
    title: 'Sustainable Fashion Workshop',
    titleHi: 'सस्टेनेबल फैशन वर्कशॉप',
    date: 'March 29, 2024',
    time: '10:00 AM - 3:00 PM',
    price: '₹1,999',
    seats: 25,
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600',
    description: 'Learn eco-friendly fashion design and sustainable practices.',
  },
];

export function WorkshopsPage() {
  const { language } = useApp();

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {language === 'en' ? 'Upcoming Workshops' : 'आगामी वर्कशॉप'}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Join our exclusive workshops and learn from industry experts'
              : 'हमारे विशेष वर्कशॉप में शामिल हों और उद्योग के विशेषज्ञों से सीखें'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-red-600 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={workshop.image}
                  alt={workshop.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-1 rounded">
                  <Calendar size={14} className="inline mr-1" />
                  {workshop.date}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {language === 'en' ? workshop.title : workshop.titleHi}
                </h3>

                <p className="text-gray-400 text-sm mb-4">
                  {workshop.description}
                </p>

                <div className="space-y-2 text-gray-400 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{workshop.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{workshop.seats} {language === 'en' ? 'seats available' : 'सीटें उपलब्ध'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500 font-semibold">
                    <IndianRupee size={16} />
                    <span>{workshop.price}</span>
                  </div>
                </div>

                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-medium">
                  {language === 'en' ? 'Register Now' : 'अभी पंजीकरण करें'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

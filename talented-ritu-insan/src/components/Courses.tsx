import { Clock, IndianRupee, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const coursesData = [
    {
        id: 1,
        title: 'Fashion Design Fundamentals',
        titleHi: 'फैशन डिजाइन की मूल बातें',
        duration: '3 Months',
        price: '₹15,000',
        image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400',
        category: 'Beginner',
    },
    {
        id: 2,
        title: 'Advanced Tailoring Course',
        titleHi: 'एडवांस टेलरिंग कोर्स',
        duration: '6 Months',
        price: '₹25,000',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        category: 'Advanced',
    },
    {
        id: 3,
        title: 'Boutique Management',
        titleHi: 'बुटीक मैनेजमेंट',
        duration: '4 Months',
        price: '₹20,000',
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400',
        category: 'Business',
    },
    {
        id: 4,
        title: 'Embroidery & Designing',
        titleHi: 'एम्ब्रॉयडरी और डिजाइनिंग',
        duration: '2 Months',
        price: '₹10,000',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
        category: 'Specialization',
    },
];

export function Courses() {
    const { t, language } = useApp();

    return (
        <section className="py-20 bg-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {t.courses.title}
                    </h2>
                    <p className="text-gray-400 text-lg">
                        {t.courses.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {coursesData.map((course) => (
                        <div
                            key={course.id}
                            className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-red-600 transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                                <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                                    {course.category}
                                </span>
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-white mb-3">
                                    {language === 'en' ? course.title : course.titleHi}
                                </h3>

                                <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {course.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <IndianRupee size={14} />
                                        {course.price}
                                    </span>
                                </div>

                                <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">
                                    {t.courses.enroll}
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

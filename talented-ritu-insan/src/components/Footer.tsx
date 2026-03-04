import { Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Footer() {
  const { t } = useApp();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">Talented Ritu Insan</h3>
            <p className="text-gray-400 mb-4">{t.footer.description}</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Youtube size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/courses" className="text-gray-400 hover:text-white transition-colors">Courses</a></li>
              <li><a href="/workshops" className="text-gray-400 hover:text-white transition-colors">Workshops</a></li>
              <li><a href="/our-superstars" className="text-gray-400 hover:text-white transition-colors">Our Superstars</a></li>
              <li><a href="/referral" className="text-gray-400 hover:text-white transition-colors">Refer & Earn</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={16} />
                <span>info@talentedrituinsan.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} />
                <span>Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500">{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

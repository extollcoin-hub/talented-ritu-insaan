import { useState } from 'react';
import { ArrowLeft, Gift, Users, IndianRupee, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function ReferralPage() {
  const { language } = useApp();
  const [formData, setFormData] = useState({
    referrerName: '',
    referrerPhone: '',
    refereeName: '',
    refereePhone: '',
    courseName: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Referral submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full px-4 py-2 mb-6">
              <Gift className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-400 text-sm font-medium">
                {language === 'en' ? '🎁 REFER & EARN' : '🎁 रेफर करें और कमाएं'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {language === 'en' ? 'Refer a Friend & Earn ₹500' : 'दोस्त को रेफर करें और ₹500 कमाएं'}
            </h1>
            <p className="text-gray-400 text-lg">
              {language === 'en'
                ? 'Share your love for fashion and earn rewards for every successful referral!'
                : 'फैशन के प्रति अपना प्यार साझा करें और हर सफल रेफरल के लिए पुरस्कार कमाएं!'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
              <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                {language === 'en' ? 'Step 1' : 'चरण 1'}
              </h3>
              <p className="text-gray-400 text-sm">
                {language === 'en' ? 'Refer a friend to our courses' : 'अपने दोस्त को हमारे कोर्स में रेफर करें'}
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                {language === 'en' ? 'Step 2' : 'चरण 2'}
              </h3>
              <p className="text-gray-400 text-sm">
                {language === 'en' ? 'Your friend enrolls in a course' : 'आपका दोस्त कोर्स में एनरोल होता है'}
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
              <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <IndianRupee className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                {language === 'en' ? 'Step 3' : 'चरण 3'}
              </h3>
              <p className="text-gray-400 text-sm">
                {language === 'en' ? 'Earn ₹500 cash reward!' : '₹500 कैश रिवॉर्ड कमाएं!'}
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="bg-green-600/20 border border-green-500 rounded-xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {language === 'en' ? 'Referral Submitted!' : 'रेफरल सबमिट हो गया!'}
              </h2>
              <p className="text-gray-400">
                {language === 'en'
                  ? 'We will contact your friend soon. Once they enroll, you will receive your reward!'
                  : 'हम जल्द ही आपके दोस्त से संपर्क करेंगे। एक बार जब वे एनरोल हो जाएंगे, आपको अपना इनाम मिलेगा!'}
              </p>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">
                {language === 'en' ? 'Submit a Referral' : 'रेफरल सबमिट करें'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {language === 'en' ? 'Your Name' : 'आपका नाम'}
                    </label>
                    <input
                      type="text"
                      value={formData.referrerName}
                      onChange={(e) => setFormData({ ...formData, referrerName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {language === 'en' ? 'Your Phone' : 'आपका फोन'}
                    </label>
                    <input
                      type="tel"
                      value={formData.referrerPhone}
                      onChange={(e) => setFormData({ ...formData, referrerPhone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {language === 'en' ? "Friend's Name" : 'दोस्त का नाम'}
                    </label>
                    <input
                      type="text"
                      value={formData.refereeName}
                      onChange={(e) => setFormData({ ...formData, refereeName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {language === 'en' ? "Friend's Phone" : 'दोस्त का फोन'}
                    </label>
                    <input
                      type="tel"
                      value={formData.refereePhone}
                      onChange={(e) => setFormData({ ...formData, refereePhone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'en' ? 'Course Interest (Optional)' : 'कोर्स में रुचि (वैकल्पिक)'}
                  </label>
                  <select
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">Select a course</option>
                    <option value="Fashion Design Fundamentals">Fashion Design Fundamentals</option>
                    <option value="Advanced Tailoring Course">Advanced Tailoring Course</option>
                    <option value="Boutique Management">Boutique Management</option>
                    <option value="Embroidery & Designing">Embroidery & Designing</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {language === 'en' ? 'Submit Referral' : 'रेफरल सबमिट करें'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8 text-center">GET IN TOUCH</h1>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-[#111111] border border-white/10 p-6">
                <Mail className="w-8 h-8 text-[#E60000] mb-4" />
                <h3 className="text-white font-bold uppercase mb-2">EMAIL US</h3>
                <p className="text-[#A1A1AA] text-sm">support@zuro.com</p>
                <p className="text-[#A1A1AA] text-sm">orders@zuro.com</p>
              </div>
              <div className="bg-[#111111] border border-white/10 p-6">
                <Phone className="w-8 h-8 text-[#E60000] mb-4" />
                <h3 className="text-white font-bold uppercase mb-2">CALL US</h3>
                <p className="text-[#A1A1AA] text-sm">+91 98765 43210</p>
                <p className="text-[#A1A1AA] text-sm">Mon-Sat: 10 AM - 7 PM IST</p>
              </div>
              <div className="bg-[#111111] border border-white/10 p-6">
                <MessageCircle className="w-8 h-8 text-[#E60000] mb-4" />
                <h3 className="text-white font-bold uppercase mb-2">WHATSAPP</h3>
                <p className="text-[#A1A1AA] text-sm">+91 98765 43210</p>
                <p className="text-[#A1A1AA] text-sm">Chat with us instantly</p>
              </div>
              <div className="bg-[#111111] border border-white/10 p-6">
                <MapPin className="w-8 h-8 text-[#E60000] mb-4" />
                <h3 className="text-white font-bold uppercase mb-2">VISIT US</h3>
                <p className="text-[#A1A1AA] text-sm">ZURO Headquarters</p>
                <p className="text-[#A1A1AA] text-sm">123 Fashion Street, Bandra West</p>
                <p className="text-[#A1A1AA] text-sm">Mumbai, Maharashtra 400050</p>
              </div>
            </div>
            <div className="bg-[#111111] border border-white/10 p-8">
              <h2 className="text-xl uppercase font-bold text-white mb-6">SEND US A MESSAGE</h2>
              <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none" />
                <input type="email" placeholder="Your Email" className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none" />
                <input type="text" placeholder="Subject" className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none" />
                <textarea rows="6" placeholder="Your Message" className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none"></textarea>
                <button type="submit" className="w-full bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4">SEND MESSAGE</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
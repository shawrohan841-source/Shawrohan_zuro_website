import Header from '../components/Header';
import Footer from '../components/Footer';
import { Truck, Package, MapPin, Clock } from 'lucide-react';

const ShippingPage = () => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8">SHIPPING POLICY</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { icon: Truck, title: 'FREE SHIPPING', desc: 'On orders above ₹999' },
              { icon: Package, title: 'SAFE PACKAGING', desc: 'Secure bubble wrap' },
              { icon: Clock, title: 'FAST DELIVERY', desc: '3-5 business days' },
              { icon: MapPin, title: 'ALL INDIA', desc: 'Pan-India delivery' },
            ].map((item, i) => (
              <div key={i} className="bg-[#111111] border border-white/10 p-6 flex items-center gap-4">
                <item.icon className="w-10 h-10 text-[#E60000]" />
                <div>
                  <h3 className="text-white font-bold uppercase text-sm">{item.title}</h3>
                  <p className="text-[#A1A1AA] text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[#111111] border border-white/10 p-8 space-y-6">
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">PROCESSING TIME</h2>
              <ul className="list-disc list-inside text-[#A1A1AA] space-y-2">
                <li>Orders are processed within 1-2 business days</li>
                <li>Custom products may take 2-3 days for printing</li>
                <li>Orders placed on weekends ship on Monday</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">DELIVERY TIME</h2>
              <ul className="list-disc list-inside text-[#A1A1AA] space-y-2">
                <li>Metro cities: 2-3 business days</li>
                <li>Other cities: 4-5 business days</li>
                <li>Remote areas: 5-7 business days</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">SHIPPING CHARGES</h2>
              <p className="text-[#A1A1AA] leading-relaxed">₹99 flat shipping on orders below ₹999. FREE shipping on orders above ₹999. Cash on Delivery available with ₹50 extra charge.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">TRACKING</h2>
              <p className="text-[#A1A1AA] leading-relaxed">You'll receive a tracking link via email and SMS once your order ships. Track your order anytime from your profile page.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">SHIPPING PARTNERS</h2>
              <p className="text-[#A1A1AA] leading-relaxed">We ship via trusted courier partners: Delhivery, Blue Dart, and India Post. Partner is selected based on your location for fastest delivery.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingPage;
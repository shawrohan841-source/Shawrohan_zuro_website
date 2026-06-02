import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8">TERMS & CONDITIONS</h1>
          <div className="bg-[#111111] border border-white/10 p-8 space-y-6">
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">1. ACCEPTANCE OF TERMS</h2>
              <p className="text-[#A1A1AA] leading-relaxed">By accessing and using ZURO's website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">2. PRODUCTS & PRICING</h2>
              <p className="text-[#A1A1AA] leading-relaxed">All products are subject to availability. Prices are in Indian Rupees (INR) and include applicable taxes. We reserve the right to modify prices at any time without prior notice.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">3. ORDERS & PAYMENT</h2>
              <p className="text-[#A1A1AA] leading-relaxed">By placing an order, you agree to provide accurate and complete information. We accept payments via Razorpay (UPI, Cards, Net Banking) and Cash on Delivery. All transactions are secure and encrypted.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">4. CUSTOM ORDERS</h2>
              <p className="text-[#A1A1AA] leading-relaxed">Custom printed products are made-to-order and cannot be cancelled once production begins. Please review your design carefully before placing an order.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">5. INTELLECTUAL PROPERTY</h2>
              <p className="text-[#A1A1AA] leading-relaxed">All content, designs, and trademarks on ZURO are owned by us. Unauthorized use of any materials may violate copyright and trademark laws.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">6. USER CONDUCT</h2>
              <p className="text-[#A1A1AA] leading-relaxed">You agree not to use the website for any unlawful purpose or to violate any laws. You will not upload offensive content or infringe upon others' intellectual property rights.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">7. LIMITATION OF LIABILITY</h2>
              <p className="text-[#A1A1AA] leading-relaxed">ZURO shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">8. CHANGES TO TERMS</h2>
              <p className="text-[#A1A1AA] leading-relaxed">We reserve the right to update these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.</p>
            </div>
            <div className="pt-6 border-t border-white/10">
              <p className="text-sm text-[#A1A1AA]">Last updated: January 2026</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;
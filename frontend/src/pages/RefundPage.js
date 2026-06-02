import Header from '../components/Header';
import Footer from '../components/Footer';

const RefundPage = () => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8">REFUND & RETURN POLICY</h1>
          <div className="bg-[#111111] border border-white/10 p-8 space-y-6">
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">1. RETURN ELIGIBILITY</h2>
              <p className="text-[#A1A1AA] leading-relaxed">We accept returns within 7 days of delivery. Products must be:</p>
              <ul className="list-disc list-inside text-[#A1A1AA] space-y-2 mt-3">
                <li>Unused and unwashed</li>
                <li>In original packaging with tags intact</li>
                <li>Free from any damage or stains</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">2. NON-RETURNABLE ITEMS</h2>
              <ul className="list-disc list-inside text-[#A1A1AA] space-y-2">
                <li>Custom printed products</li>
                <li>Sale or clearance items</li>
                <li>Products without original tags</li>
                <li>Accessories and innerwear</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">3. HOW TO RETURN</h2>
              <p className="text-[#A1A1AA] leading-relaxed mb-3">To initiate a return:</p>
              <ol className="list-decimal list-inside text-[#A1A1AA] space-y-2">
                <li>Contact us at returns@zuro.com with your order number</li>
                <li>Our team will provide return instructions</li>
                <li>Pack the item securely with invoice</li>
                <li>Ship it to our returns address</li>
              </ol>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">4. REFUND PROCESS</h2>
              <p className="text-[#A1A1AA] leading-relaxed">Once we receive and inspect your return:</p>
              <ul className="list-disc list-inside text-[#A1A1AA] space-y-2 mt-3">
                <li>Approved refunds are processed within 5-7 business days</li>
                <li>Refunds are issued to the original payment method</li>
                <li>Shipping charges are non-refundable</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">5. EXCHANGES</h2>
              <p className="text-[#A1A1AA] leading-relaxed">We offer size exchanges for non-custom products. Contact us within 7 days of delivery. Exchanges are subject to product availability.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">6. DAMAGED OR DEFECTIVE ITEMS</h2>
              <p className="text-[#A1A1AA] leading-relaxed">If you receive a damaged or defective item, contact us immediately with photos. We'll arrange a replacement or full refund including shipping charges.</p>
            </div>
            <div className="pt-6 border-t border-white/10">
              <p className="text-sm text-[#A1A1AA]">For any questions, contact us at support@zuro.com or WhatsApp: +91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPage;
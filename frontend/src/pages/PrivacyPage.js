import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8">PRIVACY POLICY</h1>
          <div className="bg-[#111111] border border-white/10 p-8 space-y-6">
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">1. INFORMATION WE COLLECT</h2>
              <p className="text-[#A1A1AA] leading-relaxed mb-3">We collect information you provide directly to us when you:</p>
              <ul className="list-disc list-inside text-[#A1A1AA] space-y-2">
                <li>Create an account or make a purchase</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact our customer support</li>
                <li>Upload custom designs</li>
              </ul>
              <p className="text-[#A1A1AA] leading-relaxed mt-3">Information includes: name, email, phone number, shipping address, and payment details.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">2. HOW WE USE YOUR INFORMATION</h2>
              <ul className="list-disc list-inside text-[#A1A1AA] space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Provide customer support</li>
                <li>Send promotional offers (with your consent)</li>
                <li>Improve our website and services</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">3. DATA SECURITY</h2>
              <p className="text-[#A1A1AA] leading-relaxed">We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology. However, no method of transmission over the internet is 100% secure.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">4. COOKIES</h2>
              <p className="text-[#A1A1AA] leading-relaxed">We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can disable cookies in your browser settings, but this may affect website functionality.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">5. THIRD-PARTY SERVICES</h2>
              <p className="text-[#A1A1AA] leading-relaxed">We use third-party services like Razorpay for payments and Resend for emails. These services have their own privacy policies and data handling practices.</p>
            </div>
            <div>
              <h2 className="text-xl uppercase font-bold text-white mb-3">6. YOUR RIGHTS</h2>
              <p className="text-[#A1A1AA] leading-relaxed">You have the right to access, update, or delete your personal information. Contact us at privacy@zuro.com for any privacy-related requests.</p>
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

export default PrivacyPage;
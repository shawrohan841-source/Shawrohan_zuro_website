import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "What is DTF printing?",
      a: "DTF (Direct to Film) is a premium printing technique that creates vibrant, durable designs on fabric. It offers better quality and longevity compared to traditional screen printing."
    },
    {
      q: "How do I choose the right size?",
      a: "Check our size guide for detailed measurements. Our oversized fit is intentionally roomier. If you prefer a regular fit, size down. For oversized look, go with your usual size."
    },
    {
      q: "Can I customize my own design?",
      a: "Yes! Use our Custom Builder to upload your own images or add text. You can create unique designs on any color t-shirt. Custom orders take 2-3 days for printing."
    },
    {
      q: "What is your return policy?",
      a: "We accept returns within 7 days of delivery for non-custom products. Items must be unwashed with original tags. Custom printed products cannot be returned."
    },
    {
      q: "How long does shipping take?",
      a: "Metro cities: 2-3 days, Other cities: 4-5 days, Remote areas: 5-7 days. Free shipping on orders above ₹999."
    },
    {
      q: "Is Cash on Delivery available?",
      a: "Yes, COD is available with ₹50 extra charge. You can also pay online via UPI, Cards, Net Banking, or Wallets through Razorpay."
    },
    {
      q: "How do I track my order?",
      a: "After your order ships, you will receive a tracking link via email and SMS. You can also track from your profile page on the website."
    },
    {
      q: "Are the colors exactly as shown?",
      a: "We try to display colors accurately, but slight variations may occur due to screen settings. All our t-shirts are photographed in natural light for true representation."
    },
    {
      q: "Do you ship internationally?",
      a: "Currently, we ship only within India. International shipping will be available soon. Stay tuned!"
    },
    {
      q: "How do I care for my ZURO t-shirt?",
      a: "Wash inside out in cold water. Avoid bleach and tumble drying. Iron on reverse side. This ensures your print stays vibrant for years."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8 text-center">FREQUENTLY ASKED QUESTIONS</h1>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#111111] border border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-bold uppercase text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-white transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-[#A1A1AA] leading-relaxed">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: "Arjun Sharma",
    city: "Mumbai",
    avatar: "A",
    rating: 5,
    text: "ZURO is hands down the best anime streetwear brand in India! The quality is insane and designs are super unique. Been buying from them for 6 months now."
  },
  {
    name: "Priya Gupta",
    city: "Delhi",
    avatar: "P",
    rating: 5,
    text: "Finally found a brand that gets anime culture! Print quality is amazing and the oversized fit is perfect. Worth every rupee 🔥"
  },
  {
    name: "Rohan Patel",
    city: "Bangalore",
    avatar: "R",
    rating: 5,
    text: "Best purchase ever! The DTF print is so vibrant and hasn't faded even after multiple washes. Customer service is top-notch too."
  },
  {
    name: "Neha Reddy",
    city: "Hyderabad",
    avatar: "N",
    rating: 5,
    text: "Love the premium quality! Fabric is thick and comfortable. The custom builder feature is sick - made my own design and it came out perfect!"
  },
  {
    name: "Aditya Kumar",
    city: "Pune",
    avatar: "A",
    rating: 5,
    text: "These guys are legit! Fast delivery, premium packaging, and the t-shirts are fire. Will definitely recommend to all my friends."
  },
  {
    name: "Kavya Nair",
    city: "Chennai",
    avatar: "K",
    rating: 5,
    text: "Quality is unreal for the price! Oversized fit looks dope and the anime designs are so cool. ZURO is my go-to brand now."
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const next = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Show 3 testimonials on desktop, 1 on mobile
  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  return (
    <section className="py-16 md:py-24 bg-[#111111] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-2">
            WHAT OUR CUSTOMERS SAY
          </h2>
          <p className="text-base text-[#A1A1AA]">Real reviews from real customers</p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, i) => (
              <motion.div
                key={`${currentIndex}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#050505] border border-white/10 p-6 relative"
              >
                <div className="absolute top-6 right-6 opacity-10">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#E60000]/20 flex items-center justify-center text-white font-bold text-lg uppercase">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-bold">{testimonial.name}</p>
                    <p className="text-xs text-[#A1A1AA]">{testimonial.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#E60000] text-[#E60000]" />
                  ))}
                </div>

                <p className="text-[#A1A1AA] text-sm leading-relaxed relative z-10">
                  {testimonial.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAutoplay(false);
                    setCurrentIndex(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex ? 'bg-white w-8' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

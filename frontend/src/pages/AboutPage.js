import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8 text-center">ABOUT ZURO</h1>
          <div className="bg-[#111111] border border-white/10 p-8 mb-8">
            <h2 className="text-2xl uppercase font-bold text-white mb-4">WEAR YOUR ATTITUDE</h2>
            <p className="text-[#A1A1AA] leading-relaxed mb-4">ZURO is not just a clothing brand – it's a statement. We're a premium anime-inspired streetwear brand that celebrates individuality, creativity, and fearless self-expression.</p>
            <p className="text-[#A1A1AA] leading-relaxed">Founded in 2024, ZURO was born from a passion for anime culture and high-quality streetwear. We believe fashion should tell your story, reflect your personality, and make you feel unstoppable.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'PREMIUM QUALITY', desc: '100% cotton with DTF printing that lasts forever' },
              { title: 'UNIQUE DESIGNS', desc: "Exclusive anime-inspired artwork you won't find anywhere else" },
              { title: 'PERFECT FIT', desc: 'Oversized streetwear fit designed for maximum comfort' },
            ].map((item, i) => (
              <div key={i} className="bg-[#111111] border border-white/10 p-6 text-center">
                <h3 className="text-white font-bold uppercase mb-2">{item.title}</h3>
                <p className="text-[#A1A1AA] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#111111] border border-white/10 p-8">
            <h2 className="text-xl uppercase font-bold text-white mb-4">OUR MISSION</h2>
            <p className="text-[#A1A1AA] leading-relaxed mb-6">To empower the youth of India with premium anime streetwear that lets them express their unique identity without compromise. Every ZURO piece is crafted with meticulous attention to detail, from fabric selection to final stitch.</p>
            <h2 className="text-xl uppercase font-bold text-white mb-4">WHY CHOOSE ZURO?</h2>
            <ul className="space-y-3 text-[#A1A1AA]">
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-[#E60000] mt-2"></span><span>Premium DTF printing technology for vibrant, long-lasting designs</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-[#E60000] mt-2"></span><span>100% pre-shrunk cotton for perfect fit wash after wash</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-[#E60000] mt-2"></span><span>Exclusive anime artwork designed by talented Indian artists</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-[#E60000] mt-2"></span><span>Oversized drop-shoulder fit for that perfect streetwear look</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-[#E60000] mt-2"></span><span>Custom design options to create your own unique piece</span></li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
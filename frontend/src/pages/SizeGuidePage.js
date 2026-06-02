import Header from '../components/Header';
import Footer from '../components/Footer';

const SizeGuidePage = () => {
  const sizes = [
    { size: 'S', chest: '38-40', length: '27', shoulder: '17' },
    { size: 'M', chest: '40-42', length: '28', shoulder: '18' },
    { size: 'L', chest: '42-44', length: '29', shoulder: '19' },
    { size: 'XL', chest: '44-46', length: '30', shoulder: '20' },
    { size: 'XXL', chest: '46-48', length: '31', shoulder: '21' },
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8 text-center">SIZE GUIDE</h1>
          <div className="bg-[#111111] border border-white/10 p-8 mb-8">
            <h2 className="text-xl uppercase font-bold text-white mb-4">OVERSIZED FIT</h2>
            <p className="text-[#A1A1AA] leading-relaxed mb-6">Our t-shirts are designed with an oversized, relaxed fit for that premium streetwear look. The drop-shoulder design gives extra room in the shoulders and chest.</p>
            <div className="bg-[#E60000]/10 border border-[#E60000]/30 p-4 mb-6">
              <p className="text-white text-sm"><strong>Pro Tip:</strong> If you want a regular fit, size down. For the full oversized streetwear look, go with your usual size.</p>
            </div>
          </div>
          <div className="bg-[#111111] border border-white/10 overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">SIZE</th>
                  <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">CHEST (inches)</th>
                  <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">LENGTH (inches)</th>
                  <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">SHOULDER (inches)</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((item, i) => (
                  <tr key={i} className="border-b border-white/10 last:border-0">
                    <td className="p-4 text-white font-bold">{item.size}</td>
                    <td className="p-4 text-[#A1A1AA]">{item.chest}</td>
                    <td className="p-4 text-[#A1A1AA]">{item.length}</td>
                    <td className="p-4 text-[#A1A1AA]">{item.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-[#111111] border border-white/10 p-8 mt-8">
            <h2 className="text-xl uppercase font-bold text-white mb-4">HOW TO MEASURE</h2>
            <ul className="space-y-3 text-[#A1A1AA]">
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-[#E60000] mt-2"></span><span><strong className="text-white">Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-[#E60000] mt-2"></span><span><strong className="text-white">Length:</strong> Measure from the highest point of shoulder to the bottom hem</span></li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-[#E60000] mt-2"></span><span><strong className="text-white">Shoulder:</strong> Measure from one shoulder point to the other across the back</span></li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SizeGuidePage;

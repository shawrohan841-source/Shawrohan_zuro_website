import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Upload, Type, RotateCw, ZoomIn, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const CustomBuilderPage = () => {
  const [tshirtColor, setTshirtColor] = useState('white');
  const [side, setSide] = useState('front');
  const [designs, setDesigns] = useState([]);

  const colors = [
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Red', value: 'red', hex: '#E60000' },
    { name: 'Navy', value: 'navy', hex: '#1A1A2E' },
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8">CUSTOM T-SHIRT BUILDER</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-[#111111] border border-white/10 p-8 aspect-square flex items-center justify-center relative">
                <div className={`w-full max-w-md aspect-[3/4] flex items-center justify-center rounded-lg`} style={{ backgroundColor: colors.find(c => c.value === tshirtColor)?.hex }}>
                  <p className="text-gray-400 text-sm">T-Shirt {side} view</p>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button onClick={() => setSide('front')} className={`flex-1 px-6 py-3 border ${side === 'front' ? 'border-white bg-white text-black' : 'border-white/20 bg-transparent text-white'} hover:border-white/50 transition-colors uppercase text-sm font-bold`}>FRONT</button>
                <button onClick={() => setSide('back')} className={`flex-1 px-6 py-3 border ${side === 'back' ? 'border-white bg-white text-black' : 'border-white/20 bg-transparent text-white'} hover:border-white/50 transition-colors uppercase text-sm font-bold`}>BACK</button>
              </div>
            </div>
            <div>
              <div className="bg-[#111111] border border-white/10 p-6 mb-4">
                <h2 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">T-SHIRT COLOR</h2>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button key={color.value} onClick={() => setTshirtColor(color.value)} className={`w-full aspect-square border-2 ${tshirtColor === color.value ? 'border-white' : 'border-transparent'} hover:border-white/50 transition-colors`} style={{ backgroundColor: color.hex }} title={color.name} />
                  ))}
                </div>
              </div>
              <div className="bg-[#111111] border border-white/10 p-6 mb-4">
                <h2 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">ADD ELEMENTS</h2>
                <div className="space-y-2">
                  <button className="w-full px-4 py-3 border border-white/20 bg-transparent text-white hover:bg-white/5 transition-colors uppercase text-sm font-bold flex items-center justify-center gap-2"><Upload className="w-4 h-4" />UPLOAD IMAGE</button>
                  <button className="w-full px-4 py-3 border border-white/20 bg-transparent text-white hover:bg-white/5 transition-colors uppercase text-sm font-bold flex items-center justify-center gap-2"><Type className="w-4 h-4" />ADD TEXT</button>
                </div>
              </div>
              <div className="bg-[#111111] border border-white/10 p-6 mb-4">
                <h2 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">PRICE DETAILS</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#A1A1AA]">Base Price</span><span className="text-white">₹499</span></div>
                  <div className="flex justify-between"><span className="text-[#A1A1AA]">Printing</span><span className="text-white">₹200</span></div>
                  <div className="border-t border-white/10 pt-2 mt-2 flex justify-between"><span className="text-white font-bold">Total</span><span className="text-white font-bold text-lg">₹699</span></div>
                </div>
              </div>
              <button className="w-full bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4">ADD TO CART</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomBuilderPage;

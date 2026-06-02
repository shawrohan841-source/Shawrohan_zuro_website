import { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Upload, Type, RotateCw, Trash2, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// T-shirt mockup URLs for all colors
const TSHIRT_MOCKUPS = {
  white: {
    front: 'https://via.placeholder.com/600x700/FFFFFF/CCCCCC?text=White+Front',
    back: 'https://via.placeholder.com/600x700/FFFFFF/CCCCCC?text=White+Back'
  },
  black: {
    front: 'https://customer-assets.emergentagent.com/job_zuro-premium/artifacts/jxsocm1f_black-front.png',
    back: 'https://customer-assets.emergentagent.com/job_zuro-premium/artifacts/kd6axr3b_black-back.png'
  },
  green: {
    front: 'https://via.placeholder.com/600x700/22C55E/FFFFFF?text=Green+Front',
    back: 'https://customer-assets.emergentagent.com/job_zuro-premium/artifacts/g6j2ihxi_green-back.png'
  },
  blue: {
    front: 'https://customer-assets.emergentagent.com/job_zuro-premium/artifacts/2d3ttvin_blue-front.png',
    back: 'https://customer-assets.emergentagent.com/job_zuro-premium/artifacts/xk880w9l_blue-back.png'
  },
  red: {
    front: 'https://via.placeholder.com/600x700/EF4444/FFFFFF?text=Red+Front',
    back: 'https://via.placeholder.com/600x700/EF4444/FFFFFF?text=Red+Back'
  },
  yellow: {
    front: 'https://via.placeholder.com/600x700/FACC15/333333?text=Yellow+Front',
    back: 'https://via.placeholder.com/600x700/FACC15/333333?text=Yellow+Back'
  },
  lavender: {
    front: 'https://via.placeholder.com/600x700/C4B5FD/FFFFFF?text=Lavender+Front',
    back: 'https://via.placeholder.com/600x700/C4B5FD/FFFFFF?text=Lavender+Back'
  },
  orange: {
    front: 'https://via.placeholder.com/600x700/FB923C/FFFFFF?text=Orange+Front',
    back: 'https://via.placeholder.com/600x700/FB923C/FFFFFF?text=Orange+Back'
  },
};

const CustomBuilderPage = () => {
  const [tshirtColor, setTshirtColor] = useState('black');
  const [side, setSide] = useState('front');
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const colors = [
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Green', value: 'green', hex: '#22C55E' },
    { name: 'Blue', value: 'blue', hex: '#3B82F6' },
    { name: 'Red', value: 'red', hex: '#EF4444' },
    { name: 'Yellow', value: 'yellow', hex: '#FACC15' },
    { name: 'Lavender', value: 'lavender', hex: '#C4B5FD' },
    { name: 'Orange', value: 'orange', hex: '#FB923C' },
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await axios.post(`${API}/storage/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const newElement = {
        id: Date.now(),
        type: 'image',
        src: `${process.env.REACT_APP_BACKEND_URL}${data.url}`,
        x: 0,
        y: 0,
        width: 150,
        height: 150,
        rotation: 0,
        side,
      };

      setElements([...elements, newElement]);
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const addText = () => {
    const newElement = {
      id: Date.now(),
      type: 'text',
      content: 'Your Text Here',
      x: 0,
      y: 0,
      fontSize: 24,
      color: '#FFFFFF',
      rotation: 0,
      side,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateElement = (id, updates) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement === id) setSelectedElement(null);
  };

  const rotateElement = (id) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      updateElement(id, { rotation: (element.rotation + 45) % 360 });
    }
  };

  const calculatePrice = () => {
    const basePrice = 499;
    const printPrice = elements.filter(el => el.side === 'front').length > 0 ? 200 : 0;
    const backPrintPrice = elements.filter(el => el.side === 'back').length > 0 ? 150 : 0;
    return basePrice + printPrice + backPrintPrice;
  };

  const visibleElements = elements.filter(el => el.side === side);

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8">
            CUSTOM T-SHIRT BUILDER
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Canvas Area */}
            <div className="lg:col-span-2">
              <div className="bg-[#111111] border border-white/10 p-8 aspect-square flex items-center justify-center relative overflow-hidden">
                {/* T-shirt mockup */}
                <img
                  src={TSHIRT_MOCKUPS[tshirtColor][side]}
                  alt={`${tshirtColor} ${side}`}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
                
                {/* Design area overlay */}
                <div className="relative w-[60%] h-[70%] border-2 border-dashed border-white/20">
                  {visibleElements.map((element) => (
                    <Draggable
                      key={element.id}
                      position={{ x: element.x, y: element.y }}
                      onStop={(e, data) => updateElement(element.id, { x: data.x, y: data.y })}
                      bounds="parent"
                    >
                      <div
                        className={`absolute cursor-move ${
                          selectedElement === element.id ? 'ring-2 ring-white' : ''
                        }`}
                        style={{
                          transform: `rotate(${element.rotation}deg)`,
                        }}
                        onClick={() => setSelectedElement(element.id)}
                      >
                        {element.type === 'image' ? (
                          <img
                            src={element.src}
                            alt="design"
                            style={{
                              width: element.width,
                              height: element.height,
                            }}
                            className="pointer-events-none"
                          />
                        ) : (
                          <div
                            style={{
                              fontSize: element.fontSize,
                              color: element.color,
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {element.content}
                          </div>
                        )}
                      </div>
                    </Draggable>
                  ))}
                </div>
              </div>
              
              {/* Side Toggle */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setSide('front')}
                  className={`flex-1 px-6 py-3 border ${
                    side === 'front'
                      ? 'border-white bg-white text-black'
                      : 'border-white/20 bg-transparent text-white hover:border-white/50'
                  } transition-colors uppercase text-sm font-bold`}
                >
                  FRONT
                </button>
                <button
                  onClick={() => setSide('back')}
                  className={`flex-1 px-6 py-3 border ${
                    side === 'back'
                      ? 'border-white bg-white text-black'
                      : 'border-white/20 bg-transparent text-white hover:border-white/50'
                  } transition-colors uppercase text-sm font-bold`}
                >
                  BACK
                </button>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="space-y-6">
              {/* Color Selection */}
              <div className="bg-[#111111] border border-white/10 p-6">
                <h2 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">T-SHIRT COLOR</h2>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setTshirtColor(color.value)}
                      className={`w-full aspect-square border-2 ${
                        tshirtColor === color.value ? 'border-white' : 'border-transparent'
                      } hover:border-white/50 transition-colors relative`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {tshirtColor === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Elements */}
              <div className="bg-[#111111] border border-white/10 p-6">
                <h2 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">ADD ELEMENTS</h2>
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full px-4 py-3 border border-white/20 bg-transparent text-white hover:bg-white/5 transition-colors uppercase text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'UPLOADING...' : 'UPLOAD IMAGE'}
                  </button>
                  <button
                    onClick={addText}
                    className="w-full px-4 py-3 border border-white/20 bg-transparent text-white hover:bg-white/5 transition-colors uppercase text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Type className="w-4 h-4" />
                    ADD TEXT
                  </button>
                </div>
              </div>

              {/* Element Controls */}
              {selectedElement && (
                <div className="bg-[#111111] border border-white/10 p-6">
                  <h2 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">EDIT ELEMENT</h2>
                  {(() => {
                    const element = elements.find(el => el.id === selectedElement);
                    if (!element) return null;
                    return (
                      <div className="space-y-3">
                        {element.type === 'text' && (
                          <>
                            <input
                              type="text"
                              value={element.content}
                              onChange={(e) => updateElement(element.id, { content: e.target.value })}
                              className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-2 text-white focus:border-white focus:outline-none"
                            />
                            <input
                              type="number"
                              value={element.fontSize}
                              onChange={(e) => updateElement(element.id, { fontSize: parseInt(e.target.value) })}
                              className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-2 text-white focus:border-white focus:outline-none"
                              min="12"
                              max="72"
                            />
                          </>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => rotateElement(element.id)}
                            className="flex-1 px-4 py-2 border border-white/20 bg-transparent text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                          >
                            <RotateCw className="w-4 h-4" />
                            ROTATE
                          </button>
                          <button
                            onClick={() => deleteElement(element.id)}
                            className="flex-1 px-4 py-2 border border-[#E60000]/50 bg-transparent text-[#E60000] hover:bg-[#E60000]/10 transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            DELETE
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Price Details */}
              <div className="bg-[#111111] border border-white/10 p-6">
                <h2 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">PRICE DETAILS</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Base Price</span>
                    <span className="text-white">₹499</span>
                  </div>
                  {elements.filter(el => el.side === 'front').length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#A1A1AA]">Front Print</span>
                      <span className="text-white">₹200</span>
                    </div>
                  )}
                  {elements.filter(el => el.side === 'back').length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#A1A1AA]">Back Print</span>
                      <span className="text-white">₹150</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-white font-bold text-lg">₹{calculatePrice()}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4"
                onClick={() => toast.success('Custom design saved! Add to cart feature coming soon.')}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomBuilderPage;